// src/utils/exportPriceExcel.ts
import ExcelJS from "exceljs";

type Lead = any;
type Customer = any;
type Contact = any;
type Country = any;
type City = any;
type Line = any;
type Category = any;
type Origin = any;
type State = any;
type Priority = any;
type User = any;

function num(v: any) {
    const n = Number(v ?? 0);
    return isNaN(n) ? 0 : n;
}

function dateOnly(d: any) {
    if (!d) return null;
    const dt = new Date(d);
    if (isNaN(dt.getTime())) return null;
    return new Date(dt.getFullYear(), dt.getMonth(), dt.getDate());
}

function getActivityDate(lead: any, activityTypeId: number) {
    if (!Array.isArray(lead.activities)) return null;

    const acts = lead.activities
        .filter((a: any) => a.activityTypeId === activityTypeId)
        .sort(
            (a: any, b: any) =>
                new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );

    if (acts.length === 0) return null;

    return dateOnly(acts[0].createdAt);
}

// ================== ESTILOS ==================

function styleHeaderAt(sheet: ExcelJS.Worksheet, rowNumber: number) {
    const headerRow = sheet.getRow(rowNumber);
    headerRow.height = 28;

    headerRow.eachCell((cell) => {
        cell.font = { bold: true, size: 13, color: { argb: "FFFFFFFF" } };
        cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFB91C1C" },
        };
        cell.alignment = { vertical: "middle", horizontal: "center" };
        cell.border = {
            top: { style: "thin" },
            bottom: { style: "thin" },
            left: { style: "thin" },
            right: { style: "thin" },
        };
    });
}

function styleDataBody(
    sheet: ExcelJS.Worksheet,
    startRow: number,
    noCenterCols: number[] = []
) {
    sheet.eachRow((row, rowNumber) => {
        if (rowNumber < startRow) return;

        const isEven = rowNumber % 2 === 0;

        row.eachCell((cell, colNumber) => {
            if (!noCenterCols.includes(colNumber)) {
                cell.alignment = { vertical: "middle", horizontal: "center" };
            }

            cell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: isEven ? "FFF3F4F6" : "FFFFFFFF" },
            };

            cell.border = {
                top: { style: "thin" },
                bottom: { style: "thin" },
                left: { style: "thin" },
                right: { style: "thin" },
            };
        });
    });
}

function enableFilterOnHeader(sheet: ExcelJS.Worksheet, headerRow = 1) {
    const lastCol = sheet.columnCount;
    const lastColLetter = sheet.getColumn(lastCol).letter;

    sheet.autoFilter = {
        from: `A${headerRow}`,
        to: `${lastColLetter}${headerRow}`,
    };
}

// ================== DATOS USADOS ==================

function getUsedEntities(
    leads: Lead[],
    customers: Customer[],
    contacts: Contact[]
) {
    const usedCustomerIds = new Set(leads.map((l) => String(l.customerId)));
    const usedCustomers = customers.filter((c) =>
        usedCustomerIds.has(String(c.id))
    );
    const usedContacts = contacts.filter((c) =>
        usedCustomerIds.has(String(c.customerId))
    );
    return { usedCustomers, usedContacts };
}

// ================== EXPORT ==================

export async function exportPriceExcel(
    leads: Lead[],
    customers: Customer[],
    contacts: Contact[],
    countries: Country[],
    cities: City[],
    lines: Line[],
    categories: Category[],
    origines: Origin[],
    states: State[],
    priorities: Priority[],
    users: User[],
    fileName = "Cotizados"
) {
    const workbook = new ExcelJS.Workbook();

    const countryMap = new Map(countries.map((c) => [String(c.id), c.name]));
    const cityMap = new Map(cities.map((c) => [String(c.id), c.name]));
    const lineMap = new Map(lines.map((c) => [String(c.id), c.name]));
    const categoryMap = new Map(categories.map((c) => [String(c.id), c.name]));
    const originMap = new Map(origines.map((c) => [String(c.id), c.name]));
    const countryPrefixMap = new Map(
        countries.map((c) => [
            String(c.id),
            String(c.prefix ?? "").replace("+", "")
        ])
    );
    const stateMap = new Map(states.map((c) => [String(c.id), c.name]));
    const prioritiesMap = new Map(priorities.map((c) => [String(c.id), c.name]));
    const usersMap = new Map(
        users.map((u) => [
            String(u.id),
            `${u.name ?? ""} ${u.lastName ?? ""}`.trim()
        ])
    );
    const { usedCustomers, usedContacts } = getUsedEntities(
        leads,
        customers,
        contacts
    );

    // ================= RESUMEN POR ESTADO =================
    type ResumenEstado = {
        estado: string;
        cantidad: number;
        total: number;
    };

    const resumenPorEstadoMap = new Map<string, ResumenEstado>();

    for (let estadoId = 2; estadoId <= 7; estadoId++) {
        const nombreEstado = stateMap.get(String(estadoId)) ?? `Estado ${estadoId}`;

        resumenPorEstadoMap.set(nombreEstado, {
            estado: nombreEstado,
            cantidad: 0,
            total: 0,
        });
    }

    for (const lead of leads) {
        const estado = stateMap.get(String(lead.stateId)) ?? "Sin estado";
        const valor = num(lead.quotedValue);
        if (!resumenPorEstadoMap.has(estado)) {
            resumenPorEstadoMap.set(estado, {
                estado,
                cantidad: 0,
                total: 0,
            });
        }
        const r = resumenPorEstadoMap.get(estado)!;
        r.cantidad += 1;
        r.total += valor;
    }

    const resumenPorEstado = Array.from(resumenPorEstadoMap.values());

    // ================= RESUMEN =================
    const resumen = workbook.addWorksheet("Resumen");
    resumen.columns = [
        { header: "Indicador", key: "indicador", width: 30 },
        { header: "Valor", key: "valor", width: 20 },
    ];
    const totalCotizado = leads.reduce((acc, l) => acc + num(l.quotedValue), 0);
    resumen.addRow({ indicador: "Casos exportados", valor: leads.length });
    resumen.getColumn("valor").numFmt = "0";
    resumen.addRow({ indicador: "Total cotizado", valor: totalCotizado });

    styleHeaderAt(resumen, 1);
    styleDataBody(resumen, 2);
    let startRow = 6;

    // ================= RESUMEN POR ESTADOS =================
    resumen.getCell(`A${startRow}`).value = "RESUMEN POR ESTADO";
    resumen.getCell(`A${startRow}`).font = { bold: true };
    resumen.getColumn(3).width = 50; // Total cotizado (más ancha)

    startRow += 1;

    resumen.getRow(startRow).values = ["Estado", "Cantidad De Leads", "Total Cotizado"];
    styleHeaderAt(resumen, startRow);

    startRow += 1;

    let totalLeadsGeneral = 0;
    let totalCotizadoGeneral = 0;

    for (const r of resumenPorEstado) {
        resumen.addRow([r.estado, r.cantidad, r.total]);
        totalLeadsGeneral += r.cantidad;
        totalCotizadoGeneral += r.total;
    }

    const totalRow = resumen.addRow(["TOTAL GENERAL", totalLeadsGeneral, totalCotizadoGeneral]);
    totalRow.font = { bold: true };

    resumen.getColumn(2).numFmt = "0";
    resumen.getColumn(3).numFmt = "#,##0.00";
    resumen.getCell("B3").numFmt = "#,##0.00";
    styleDataBody(resumen, startRow);

    // ================= CONTACTOS =================
    const contactosSheet = workbook.addWorksheet("CONTACTOS");

    contactosSheet.columns = [
        { header: "Código contacto", key: "id", width: 20 },
        { header: "Nombre", key: "nombre", width: 30 },
        { header: "Teléfono", key: "tel", width: 18 },
        { header: "Email", key: "email", width: 50 },
        { header: "Código cliente", key: "cliente", width: 16 },
    ];

    styleHeaderAt(contactosSheet, 1);
    enableFilterOnHeader(contactosSheet, 1);
    contactosSheet.views = [{ state: "frozen", ySplit: 1 }];

    usedContacts.forEach((c) => {
        const customer = usedCustomers.find(
            (cu) => String(cu.id) === String(c.customerId)
        );

        const prefix =
            countryPrefixMap.get(String(customer?.countryId)) ?? "";

        contactosSheet.addRow({
            id: Number(c.id),
            nombre: `${c.name ?? ""}`.trim(),
            tel: prefix
                ? `+${prefix} ${c.numberPhone ?? ""}`
                : c.numberPhone ?? "",
            email: c.email ?? "",
            cliente: Number(c.customerId) ?? "",
        });
    });

    styleDataBody(contactosSheet, 2);

    // ================= CLIENTES =================
    const clientesSheet = workbook.addWorksheet("CLIENTES");

    clientesSheet.columns = [
        { header: "Código del cliente", key: "id", width: 20 },
        { header: "Cliente", key: "name", width: 30 },
        { header: "País", key: "pais", width: 20 },
        { header: "Ciudad", key: "ciudad", width: 20 },
    ];

    styleHeaderAt(clientesSheet, 1);
    enableFilterOnHeader(clientesSheet, 1);
    clientesSheet.views = [{ state: "frozen", ySplit: 1 }];

    usedCustomers.forEach((c) => {
        clientesSheet.addRow({
            id: Number(c.id),
            name: c.name,
            pais: countryMap.get(String(c.countryId)) ?? "",
            ciudad: cityMap.get(String(c.cityId)) ?? "",
        });
    });

    styleDataBody(clientesSheet, 2);

    // ================= INFORME GLOBAL COTIZADO =================
    const sheet = workbook.addWorksheet("INFORME GLOBAL COTIZADO");

    sheet.columns = [
        { header: "Caso", key: "caso", width: 10 },
        { header: "Código del cliente", key: "codCliente", width: 22 },
        { header: "Cliente", key: "cliente", width: 28 },
        { header: "País", key: "pais", width: 18 },
        { header: "Ciudad", key: "ciudad", width: 18 },
        { header: "Encargado", key: "user", width: 30 },
        { header: "Fecha creación", key: "fechaCreacion", width: 20 },
        { header: "Ingeniero", key: "engineering", width: 30 },
        { header: "Estado", key: "state", width: 18 },
        { header: "Línea", key: "line", width: 18 },
        { header: "Producto", key: "category", width: 18 },
        { header: "Prioridad", key: "priority", width: 18 },
        { header: "Origen", key: "origin", width: 18 },
        { header: "Fecha cotización", key: "fechaCotizacion", width: 20 },
        { header: "Código de Cotización", key: "cot", width: 22 },
        { header: "Valor cotizado", key: "valorCot", width: 25 },
        { header: "Contactos", key: "contactos", width: 50 },
        { header: "Observaciones", key: "obs", width: 80 },
    ];

    styleHeaderAt(sheet, 1);
    enableFilterOnHeader(sheet, 1);
    sheet.views = [{ state: "frozen", ySplit: 1 }];
    sheet.getColumn("contactos").alignment = { wrapText: true, vertical: "top" };
    sheet.getColumn("obs").alignment = { wrapText: true, vertical: "top" };

    for (const lead of leads) {
        const customer = usedCustomers.find(
            (c) => String(c.id) === String(lead.customerId)
        );

        const contactosCliente = usedContacts
            .filter((c) => String(c.customerId) === String(lead.customerId))
            .map((c) => {
                const customer = usedCustomers.find(
                    (cu) => String(cu.id) === String(c.customerId)
                );

                const prefix =
                    countryPrefixMap.get(String(customer?.countryId)) ?? "";

                return `Nombre: ${c.name ?? ""}
                        Correo: ${c.email ?? ""}
                        Teléfono: ${prefix ? `+${prefix} ${c.numberPhone ?? ""}` : c.numberPhone ?? ""
                }`;
            }).join("\n\n");

        const fechaCreacion = getActivityDate(lead, 1);
        const fechaCotizacion = getActivityDate(lead, 9);

        const row = sheet.addRow({
            caso: Number(lead.id),
            codCliente: Number(lead.customerId),
            cliente: customer?.name ?? "",
            pais: countryMap.get(String(customer?.countryId)) ?? "",
            ciudad: cityMap.get(String(customer?.cityId)) ?? "",
            line: lineMap.get(String(lead.lineId)) ?? "",
            category: categoryMap.get(String(lead.categoryId)) ?? "",
            user: usersMap.get(String(lead.userId)) ?? "",
            engineering: usersMap.get(String(lead.engineeringUserId)) ?? "——",
            state: stateMap.get(String(lead?.stateId)) ?? "",
            priority: prioritiesMap.get(String(lead.priorityId)) ?? "",
            fechaCreacion: fechaCreacion ?? "——",
            fechaCotizacion: fechaCotizacion ?? "——",
            origin: originMap.get(String(lead.originId)) ?? "",
            cot: Number(lead.cotization) ?? "",
            valorCot: num(lead.quotedValue),
            contactos: contactosCliente || "——",
            obs: lead.observations ?? "",
        });

        const contactosText = String(contactosCliente || "—");
        const lineCount = contactosText.split("\n").length;
        const baseHeight = 20;
        const lineHeight = 15;

        row.height = baseHeight + lineCount * lineHeight;
    }

    sheet.getColumn("valorCot").numFmt = "#,##0.00";

    styleDataBody(sheet, 2, [17, 18]);
    styleHeaderAt(sheet, 1);

    // ================= COTIZADO =================
    const cotizacionsheet = workbook.addWorksheet("COTIZADO");

    cotizacionsheet.columns = [
        { header: "Caso", key: "caso", width: 10 },
        { header: "Código del cliente", key: "codCliente", width: 22 },
        { header: "Cliente", key: "cliente", width: 28 },
        { header: "País", key: "pais", width: 18 },
        { header: "Ciudad", key: "ciudad", width: 18 },
        { header: "Encargado", key: "user", width: 30 },
        { header: "Fecha creación", key: "fechaCreacion", width: 20 },
        { header: "Ingeniero", key: "engineering", width: 30 },
        { header: "Estado", key: "state", width: 18 },
        { header: "Línea", key: "line", width: 18 },
        { header: "Producto", key: "category", width: 18 },
        { header: "Prioridad", key: "priority", width: 18 },
        { header: "Origen", key: "origin", width: 18 },
        { header: "Fecha cotización", key: "fechaCotizacion", width: 20 },
        { header: "Código de Cotización", key: "cot", width: 22 },
        { header: "Valor cotizado", key: "valorCot", width: 25 },
        { header: "Contactos", key: "contactos", width: 50 },
        { header: "Observaciones", key: "obs", width: 80 },
    ];

    styleHeaderAt(cotizacionsheet, 1);
    enableFilterOnHeader(cotizacionsheet, 1);
    cotizacionsheet.views = [{ state: "frozen", ySplit: 1 }];
    cotizacionsheet.getColumn("contactos").alignment = { wrapText: true, vertical: "top" };
    cotizacionsheet.getColumn("obs").alignment = { wrapText: true, vertical: "top" };
    const leadsEstado2 = leads.filter(l => Number(l.stateId) === 2);

    for (const lead of leadsEstado2) {
        const customer = usedCustomers.find(
            (c) => String(c.id) === String(lead.customerId)
        );

        const contactosCliente = usedContacts
            .filter((c) => String(c.customerId) === String(lead.customerId))
            .map((c) => {
                const customer = usedCustomers.find(
                    (cu) => String(cu.id) === String(c.customerId)
                );
                const prefix =
                    countryPrefixMap.get(String(customer?.countryId)) ?? "";
                return `Nombre: ${c.name ?? ""}
                        Correo: ${c.email ?? ""}
                        Teléfono: ${prefix ? `+${prefix} ${c.numberPhone ?? ""}` : c.numberPhone ?? ""
                }`;
            }).join("\n\n");

        const fechaCreacion = getActivityDate(lead, 1);
        const fechaCotizacion = getActivityDate(lead, 9);
        const row = cotizacionsheet.addRow({
            caso: Number(lead.id),
            codCliente: Number(lead.customerId),
            cliente: customer?.name ?? "",
            pais: countryMap.get(String(customer?.countryId)) ?? "",
            ciudad: cityMap.get(String(customer?.cityId)) ?? "",
            line: lineMap.get(String(lead.lineId)) ?? "",
            category: categoryMap.get(String(lead.categoryId)) ?? "",
            user: usersMap.get(String(lead.userId)) ?? "",
            engineering: usersMap.get(String(lead.engineeringUserId)) ?? "——",
            state: stateMap.get(String(lead?.stateId)) ?? "",
            priority: prioritiesMap.get(String(lead.priorityId)) ?? "",
            fechaCreacion: fechaCreacion ?? "——",
            fechaCotizacion: fechaCotizacion ?? "——",
            origin: originMap.get(String(lead.originId)) ?? "",
            cot: Number(lead.cotization) ?? "",
            valorCot: num(lead.quotedValue),
            contactos: contactosCliente || "——",
            obs: lead.observations ?? "",
        });

        const contactosText = String(contactosCliente || "—");
        const lineCount = contactosText.split("\n").length;
        const baseHeight = 20;
        const lineHeight = 15;
        row.height = baseHeight + lineCount * lineHeight;
    }

    cotizacionsheet.getColumn("valorCot").numFmt = "#,##0.00";

    styleDataBody(cotizacionsheet, 2, [17, 18]);
    styleHeaderAt(cotizacionsheet, 1);

    // ================= Ingeniería =================
    const ingenieriasheet = workbook.addWorksheet("INGENIERÍA");
    ingenieriasheet.columns = [
        { header: "Caso", key: "caso", width: 10 },
        { header: "Código del cliente", key: "codCliente", width: 22 },
        { header: "Cliente", key: "cliente", width: 28 },
        { header: "País", key: "pais", width: 18 },
        { header: "Ciudad", key: "ciudad", width: 18 },
        { header: "Encargado", key: "user", width: 30 },
        { header: "Fecha creación", key: "fechaCreacion", width: 20 },
        { header: "Ingeniero", key: "engineering", width: 30 },
        { header: "Estado", key: "state", width: 18 },
        { header: "Línea", key: "line", width: 18 },
        { header: "Producto", key: "category", width: 18 },
        { header: "Prioridad", key: "priority", width: 18 },
        { header: "Origen", key: "origin", width: 18 },
        { header: "Fecha cotización", key: "fechaCotizacion", width: 20 },
        { header: "Código de Cotización", key: "cot", width: 22 },
        { header: "Valor cotizado", key: "valorCot", width: 25 },
        { header: "Contactos", key: "contactos", width: 50 },
        { header: "Observaciones", key: "obs", width: 80 },
    ];

    styleHeaderAt(ingenieriasheet, 1);
    enableFilterOnHeader(ingenieriasheet, 1);
    ingenieriasheet.views = [{ state: "frozen", ySplit: 1 }];
    ingenieriasheet.getColumn("contactos").alignment = { wrapText: true, vertical: "top" };
    ingenieriasheet.getColumn("obs").alignment = { wrapText: true, vertical: "top" };
    const leadsEstado3 = leads.filter(l => Number(l.stateId) === 3);

    for (const lead of leadsEstado3) {
        const customer = usedCustomers.find(
            (c) => String(c.id) === String(lead.customerId)
        );
        const contactosCliente = usedContacts
            .filter((c) => String(c.customerId) === String(lead.customerId))
            .map((c) => {
                const customer = usedCustomers.find(
                    (cu) => String(cu.id) === String(c.customerId)
                );

                const prefix =
                    countryPrefixMap.get(String(customer?.countryId)) ?? "";

                return `Nombre: ${c.name ?? ""}
                        Correo: ${c.email ?? ""}
                        Teléfono: ${prefix ? `+${prefix} ${c.numberPhone ?? ""}` : c.numberPhone ?? ""
                }`;
            }).join("\n\n");

        const fechaCreacion = getActivityDate(lead, 1);
        const fechaCotizacion = getActivityDate(lead, 9);
        const row = ingenieriasheet.addRow({
            caso: Number(lead.id),
            codCliente: Number(lead.customerId),
            cliente: customer?.name ?? "",
            pais: countryMap.get(String(customer?.countryId)) ?? "",
            ciudad: cityMap.get(String(customer?.cityId)) ?? "",
            line: lineMap.get(String(lead.lineId)) ?? "",
            category: categoryMap.get(String(lead.categoryId)) ?? "",
            user: usersMap.get(String(lead.userId)) ?? "",
            engineering: usersMap.get(String(lead.engineeringUserId)) ?? "——",
            state: stateMap.get(String(lead?.stateId)) ?? "",
            priority: prioritiesMap.get(String(lead.priorityId)) ?? "",
            fechaCreacion: fechaCreacion ?? "——",
            fechaCotizacion: fechaCotizacion ?? "——",
            origin: originMap.get(String(lead.originId)) ?? "",
            cot: Number(lead.cotization) ?? "",
            valorCot: num(lead.quotedValue),
            contactos: contactosCliente || "——",
            obs: lead.observations ?? "",
        });

        const contactosText = String(contactosCliente || "—");
        const lineCount = contactosText.split("\n").length;
        const baseHeight = 20;
        const lineHeight = 15;
        row.height = baseHeight + lineCount * lineHeight;
    }

    ingenieriasheet.getColumn("valorCot").numFmt = "#,##0.00";

    styleDataBody(ingenieriasheet, 2, [17, 18]);
    styleHeaderAt(ingenieriasheet, 1);

    // ================= Seguimiento =================
    const seguimientosheet = workbook.addWorksheet("SEGUIMIENTO");
    seguimientosheet.columns = [
        { header: "Caso", key: "caso", width: 10 },
        { header: "Código del cliente", key: "codCliente", width: 22 },
        { header: "Cliente", key: "cliente", width: 28 },
        { header: "País", key: "pais", width: 18 },
        { header: "Ciudad", key: "ciudad", width: 18 },
        { header: "Encargado", key: "user", width: 30 },
        { header: "Fecha creación", key: "fechaCreacion", width: 20 },
        { header: "Ingeniero", key: "engineering", width: 30 },
        { header: "Estado", key: "state", width: 18 },
        { header: "Línea", key: "line", width: 18 },
        { header: "Producto", key: "category", width: 18 },
        { header: "Prioridad", key: "priority", width: 18 },
        { header: "Origen", key: "origin", width: 18 },
        { header: "Fecha cotización", key: "fechaCotizacion", width: 20 },
        { header: "Código de Cotización", key: "cot", width: 22 },
        { header: "Valor cotizado", key: "valorCot", width: 25 },
        { header: "Contactos", key: "contactos", width: 50 },
        { header: "Observaciones", key: "obs", width: 80 },
    ];

    styleHeaderAt(seguimientosheet, 1);
    enableFilterOnHeader(seguimientosheet, 1);
    seguimientosheet.views = [{ state: "frozen", ySplit: 1 }];
    seguimientosheet.getColumn("contactos").alignment = { wrapText: true, vertical: "top" };
    seguimientosheet.getColumn("obs").alignment = { wrapText: true, vertical: "top" };
    const leadsEstado4 = leads.filter(l => Number(l.stateId) === 4);
    for (const lead of leadsEstado4) {
        const customer = usedCustomers.find(
            (c) => String(c.id) === String(lead.customerId)
        );
        const contactosCliente = usedContacts
            .filter((c) => String(c.customerId) === String(lead.customerId))
            .map(
                (c) =>
                    `Nombre: ${c.name ?? ""}\n      Correo: ${c.email ?? ""}\n      Teléfono: ${c.numberPhone ?? ""}`
            )
            .join("\n\n");
        const fechaCreacion = getActivityDate(lead, 1);
        const fechaCotizacion = getActivityDate(lead, 9);
        const row = seguimientosheet.addRow({
            caso: Number(lead.id),
            codCliente: Number(lead.customerId),
            cliente: customer?.name ?? "",
            pais: countryMap.get(String(customer?.countryId)) ?? "",
            ciudad: cityMap.get(String(customer?.cityId)) ?? "",
            line: lineMap.get(String(lead.lineId)) ?? "",
            category: categoryMap.get(String(lead.categoryId)) ?? "",
            user: usersMap.get(String(lead.userId)) ?? "",
            engineering: usersMap.get(String(lead.engineeringUserId)) ?? "——",
            state: stateMap.get(String(lead?.stateId)) ?? "",
            priority: prioritiesMap.get(String(lead.priorityId)) ?? "",
            fechaCreacion: fechaCreacion ?? "——",
            fechaCotizacion: fechaCotizacion ?? "——",
            origin: originMap.get(String(lead.originId)) ?? "",
            cot: Number(lead.cotization) ?? "",
            valorCot: num(lead.quotedValue),
            contactos: contactosCliente || "——",
            obs: lead.observations ?? "",
        });

        const contactosText = String(contactosCliente || "—");
        const lineCount = contactosText.split("\n").length;
        const baseHeight = 20;
        const lineHeight = 15;
        row.height = baseHeight + lineCount * lineHeight;
    }

    seguimientosheet.getColumn("valorCot").numFmt = "#,##0.00";

    styleDataBody(seguimientosheet, 2, [17, 18]);
    styleHeaderAt(seguimientosheet, 1);

    // ================= Kick-Off =================
    const Kickoffsheet = workbook.addWorksheet("KICK-OFF");
    Kickoffsheet.columns = [
        { header: "Caso", key: "caso", width: 10 },
        { header: "Código del cliente", key: "codCliente", width: 22 },
        { header: "Cliente", key: "cliente", width: 28 },
        { header: "País", key: "pais", width: 18 },
        { header: "Ciudad", key: "ciudad", width: 18 },
        { header: "Encargado", key: "user", width: 30 },
        { header: "Fecha creación", key: "fechaCreacion", width: 20 },
        { header: "Ingeniero", key: "engineering", width: 30 },
        { header: "Estado", key: "state", width: 18 },
        { header: "Línea", key: "line", width: 18 },
        { header: "Producto", key: "category", width: 18 },
        { header: "Prioridad", key: "priority", width: 18 },
        { header: "Origen", key: "origin", width: 18 },
        { header: "Fecha cotización", key: "fechaCotizacion", width: 20 },
        { header: "Código de Cotización", key: "cot", width: 22 },
        { header: "Valor cotizado", key: "valorCot", width: 25 },
        { header: "Contactos", key: "contactos", width: 50 },
        { header: "Observaciones", key: "obs", width: 80 },
    ];

    styleHeaderAt(Kickoffsheet, 1);
    enableFilterOnHeader(Kickoffsheet, 1);
    Kickoffsheet.views = [{ state: "frozen", ySplit: 1 }];
    Kickoffsheet.getColumn("contactos").alignment = { wrapText: true, vertical: "top" };
    Kickoffsheet.getColumn("obs").alignment = { wrapText: true, vertical: "top" };

    const leadsEstado5 = leads.filter(l => Number(l.stateId) === 5);
    for (const lead of leadsEstado5) {
        const customer = usedCustomers.find(
            (c) => String(c.id) === String(lead.customerId)
        );
        const contactosCliente = usedContacts
            .filter((c) => String(c.customerId) === String(lead.customerId))
            .map((c) => {
                const customer = usedCustomers.find(
                    (cu) => String(cu.id) === String(c.customerId)
                );
                const prefix =
                    countryPrefixMap.get(String(customer?.countryId)) ?? "";
                return `Nombre: ${c.name ?? ""}
                        Correo: ${c.email ?? ""}
                        Teléfono: ${prefix ? `+${prefix} ${c.numberPhone ?? ""}` : c.numberPhone ?? ""
                }`;
            }).join("\n\n");

        const fechaCreacion = getActivityDate(lead, 1);
        const fechaCotizacion = getActivityDate(lead, 9);
        const row = Kickoffsheet.addRow({
            caso: Number(lead.id),
            codCliente: Number(lead.customerId),
            cliente: customer?.name ?? "",
            pais: countryMap.get(String(customer?.countryId)) ?? "",
            ciudad: cityMap.get(String(customer?.cityId)) ?? "",
            line: lineMap.get(String(lead.lineId)) ?? "",
            category: categoryMap.get(String(lead.categoryId)) ?? "",
            user: usersMap.get(String(lead.userId)) ?? "",
            engineering: usersMap.get(String(lead.engineeringUserId)) ?? "——",
            state: stateMap.get(String(lead?.stateId)) ?? "",
            priority: prioritiesMap.get(String(lead.priorityId)) ?? "",
            fechaCreacion: fechaCreacion ?? "——",
            fechaCotizacion: fechaCotizacion ?? "——",
            origin: originMap.get(String(lead.originId)) ?? "",
            cot: Number(lead.cotization) ?? "",
            valorCot: num(lead.quotedValue),
            contactos: contactosCliente || "——",
            obs: lead.observations ?? "",
        });

        const contactosText = String(contactosCliente || "—");
        const lineCount = contactosText.split("\n").length;
        const baseHeight = 20;
        const lineHeight = 15;
        row.height = baseHeight + lineCount * lineHeight;
    }

    Kickoffsheet.getColumn("valorCot").numFmt = "#,##0.00";

    styleDataBody(Kickoffsheet, 2, [17, 18]);
    styleHeaderAt(Kickoffsheet, 1);

    // ================= OV =================
    const ovsheet = workbook.addWorksheet("OV");
    ovsheet.columns = [
        { header: "Caso", key: "caso", width: 10 },
        { header: "Código del cliente", key: "codCliente", width: 22 },
        { header: "Cliente", key: "cliente", width: 28 },
        { header: "País", key: "pais", width: 18 },
        { header: "Ciudad", key: "ciudad", width: 18 },
        { header: "Encargado", key: "user", width: 30 },
        { header: "Fecha creación", key: "fechaCreacion", width: 20 },
        { header: "Ingeniero", key: "engineering", width: 30 },
        { header: "Estado", key: "state", width: 18 },
        { header: "Línea", key: "line", width: 18 },
        { header: "Producto", key: "category", width: 18 },
        { header: "Prioridad", key: "priority", width: 18 },
        { header: "Origen", key: "origin", width: 18 },
        { header: "Fecha cotización", key: "fechaCotizacion", width: 20 },
        { header: "Código de Cotización", key: "cot", width: 22 },
        { header: "Valor cotizado", key: "valorCot", width: 25 },
        { header: "Contactos", key: "contactos", width: 50 },
        { header: "Observaciones", key: "obs", width: 80 },
    ];

    styleHeaderAt(ovsheet, 1);
    enableFilterOnHeader(ovsheet, 1);
    ovsheet.views = [{ state: "frozen", ySplit: 1 }];
    ovsheet.getColumn("contactos").alignment = { wrapText: true, vertical: "top" };
    ovsheet.getColumn("obs").alignment = { wrapText: true, vertical: "top" };
    const leadsEstado6 = leads.filter(l => Number(l.stateId) === 6);

    for (const lead of leadsEstado6) {
        const customer = usedCustomers.find(
            (c) => String(c.id) === String(lead.customerId)
        );
        const contactosCliente = usedContacts
            .filter((c) => String(c.customerId) === String(lead.customerId))
            .map((c) => {
                const customer = usedCustomers.find(
                    (cu) => String(cu.id) === String(c.customerId)
                );
                const prefix =
                    countryPrefixMap.get(String(customer?.countryId)) ?? "";
                return `Nombre: ${c.name ?? ""}
                        Correo: ${c.email ?? ""}
                        Teléfono: ${prefix ? `+${prefix} ${c.numberPhone ?? ""}` : c.numberPhone ?? ""
                }`;
            }).join("\n\n");

        const fechaCreacion = getActivityDate(lead, 1);
        const fechaCotizacion = getActivityDate(lead, 9);
        const row = ovsheet.addRow({
            caso: Number(lead.id),
            codCliente: Number(lead.customerId),
            cliente: customer?.name ?? "",
            pais: countryMap.get(String(customer?.countryId)) ?? "",
            ciudad: cityMap.get(String(customer?.cityId)) ?? "",
            line: lineMap.get(String(lead.lineId)) ?? "",
            category: categoryMap.get(String(lead.categoryId)) ?? "",
            user: usersMap.get(String(lead.userId)) ?? "",
            engineering: usersMap.get(String(lead.engineeringUserId)) ?? "——",
            state: stateMap.get(String(lead?.stateId)) ?? "",
            priority: prioritiesMap.get(String(lead.priorityId)) ?? "",
            fechaCreacion: fechaCreacion ?? "——",
            fechaCotizacion: fechaCotizacion ?? "——",
            origin: originMap.get(String(lead.originId)) ?? "",
            cot: Number(lead.cotization) ?? "",
            valorCot: num(lead.quotedValue),
            contactos: contactosCliente || "——",
            obs: lead.observations ?? "",
        });

        const contactosText = String(contactosCliente || "—");
        const lineCount = contactosText.split("\n").length;
        const baseHeight = 20;
        const lineHeight = 15;
        row.height = baseHeight + lineCount * lineHeight;
    }

    ovsheet.getColumn("valorCot").numFmt = "#,##0.00";

    styleDataBody(ovsheet, 2, [17, 18]);
    styleHeaderAt(ovsheet, 1);

    // ================= FACTURADO =================
    const facturadosheet = workbook.addWorksheet("FACTURADO");

    facturadosheet.columns = [
        { header: "Caso", key: "caso", width: 10 },
        { header: "Código del cliente", key: "codCliente", width: 22 },
        { header: "Cliente", key: "cliente", width: 28 },
        { header: "País", key: "pais", width: 18 },
        { header: "Ciudad", key: "ciudad", width: 18 },
        { header: "Encargado", key: "user", width: 30 },
        { header: "Fecha creación", key: "fechaCreacion", width: 20 },
        { header: "Ingeniero", key: "engineering", width: 30 },
        { header: "Estado", key: "state", width: 18 },
        { header: "Línea", key: "line", width: 18 },
        { header: "Producto", key: "category", width: 18 },
        { header: "Prioridad", key: "priority", width: 18 },
        { header: "Origen", key: "origin", width: 18 },
        { header: "Fecha cotización", key: "fechaCotizacion", width: 20 },
        { header: "Código de Cotización", key: "cot", width: 22 },
        { header: "Valor cotizado", key: "valorCot", width: 25 },
        { header: "Contactos", key: "contactos", width: 50 },
        { header: "Observaciones", key: "obs", width: 80 },
    ];

    styleHeaderAt(facturadosheet, 1);
    enableFilterOnHeader(facturadosheet, 1);
    facturadosheet.views = [{ state: "frozen", ySplit: 1 }];
    facturadosheet.getColumn("contactos").alignment = { wrapText: true, vertical: "top" };
    facturadosheet.getColumn("obs").alignment = { wrapText: true, vertical: "top" };

    const leadsEstado7 = leads.filter(l => Number(l.stateId) === 7);
    for (const lead of leadsEstado7) {
        const customer = usedCustomers.find(
            (c) => String(c.id) === String(lead.customerId)
        );

        const contactosCliente = usedContacts
            .filter((c) => String(c.customerId) === String(lead.customerId))
            .map((c) => {
                const customer = usedCustomers.find(
                    (cu) => String(cu.id) === String(c.customerId)
                );
                const prefix =
                    countryPrefixMap.get(String(customer?.countryId)) ?? "";
                return `Nombre: ${c.name ?? ""}
                        Correo: ${c.email ?? ""}
                        Teléfono: ${prefix ? `+${prefix} ${c.numberPhone ?? ""}` : c.numberPhone ?? ""
                }`;
            }).join("\n\n");

        const fechaCreacion = getActivityDate(lead, 1);
        const fechaCotizacion = getActivityDate(lead, 9);

        const row = facturadosheet.addRow({
            caso: Number(lead.id),
            codCliente: Number(lead.customerId),
            cliente: customer?.name ?? "",
            pais: countryMap.get(String(customer?.countryId)) ?? "",
            ciudad: cityMap.get(String(customer?.cityId)) ?? "",
            line: lineMap.get(String(lead.lineId)) ?? "",
            category: categoryMap.get(String(lead.categoryId)) ?? "",
            user: usersMap.get(String(lead.userId)) ?? "",
            engineering: usersMap.get(String(lead.engineeringUserId)) ?? "——",
            state: stateMap.get(String(lead?.stateId)) ?? "",
            priority: prioritiesMap.get(String(lead.priorityId)) ?? "",
            fechaCreacion: fechaCreacion ?? "——",
            fechaCotizacion: fechaCotizacion ?? "——",
            origin: originMap.get(String(lead.originId)) ?? "",
            cot: Number(lead.cotization) ?? "",
            valorCot: num(lead.quotedValue),
            contactos: contactosCliente || "——",
            obs: lead.observations ?? "",
        });

        const contactosText = String(contactosCliente || "—");
        const lineCount = contactosText.split("\n").length;
        const baseHeight = 20;
        const lineHeight = 15;
        row.height = baseHeight + lineCount * lineHeight;
    }

    facturadosheet.getColumn("valorCot").numFmt = "#,##0.00";

    styleDataBody(facturadosheet, 2, [17, 18]);
    styleHeaderAt(facturadosheet, 1);

    // ================= GUARDAR =================
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${fileName}.xlsx`;
    a.click();
    window.URL.revokeObjectURL(url);
}
