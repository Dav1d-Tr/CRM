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

/* ================== HELPERS ================== */

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
                new Date(a.createdAt).getTime() -
                new Date(b.createdAt).getTime()
        );
    return acts.length ? dateOnly(acts[0].createdAt) : null;
}

/* ================== ESTILOS ================== */

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
                cell.alignment = {
                    vertical: "middle",
                    horizontal: "center",
                };
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

/* ================== DATOS USADOS ================== */

function getUsedEntities(
    leads: Lead[],
    customers: Customer[],
    contacts: Contact[]
) {
    const usedCustomerIds = new Set(leads.map((l) => String(l.customerId)));

    return {
        usedCustomers: customers.filter((c) =>
            usedCustomerIds.has(String(c.id))
        ),
        usedContacts: contacts.filter((c) =>
            usedCustomerIds.has(String(c.customerId))
        ),
    };
}

/* ================== EXPORT ================== */

export async function generateBilledExcel(
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
    fileName = "Facturados"
) {
    /* 🔒 BLINDAJE: el Excel SOLO trabaja con facturados válidos */
    const safeLeads = leads.filter(
        (l) => l.billing && l.billingValue && l.stateId !== 8
    );

    const workbook = new ExcelJS.Workbook();

    const countryMap = new Map(countries.map((c) => [String(c.id), c.name]));
    const cityMap = new Map(cities.map((c) => [String(c.id), c.name]));
    const lineMap = new Map(lines.map((c) => [String(c.id), c.name]));
    const categoryMap = new Map(categories.map((c) => [String(c.id), c.name]));
    const originMap = new Map(origines.map((c) => [String(c.id), c.name]));
    const stateMap = new Map(states.map((c) => [String(c.id), c.name]));
    const prioritiesMap = new Map(
        priorities.map((c) => [String(c.id), c.name])
    );
    const countryPrefixMap = new Map(
        countries.map((c) => [
            String(c.id),
            String(c.prefix ?? "").replace("+", ""),
        ])
    );
    const usersMap = new Map(
        users.map((u) => [
            String(u.id),
            `${u.name ?? ""} ${u.lastName ?? ""}`.trim(),
        ])
    );

    const { usedCustomers, usedContacts } = getUsedEntities(
        safeLeads,
        customers,
        contacts
    );

    /* ================= RESUMEN ================= */

    const resumen = workbook.addWorksheet("RESUMEN");
    resumen.columns = [
        { header: "Indicador", key: "indicador", width: 30 },
        { header: "Valor", key: "valor", width: 20 },
    ];

    const totalCotizado = safeLeads.reduce(
        (acc, l) => acc + num(l.quotedValue),
        0
    );

    const totalFacturado = safeLeads.reduce(
        (acc, l) => acc + num(l.billingValue),
        0
    );

    resumen.addRow({
        indicador: "Casos Exportados",
        valor: safeLeads.length,
    });

    resumen.addRow({
        indicador: "Total Cotizado",
        valor: totalCotizado,
    });

    resumen.addRow({
        indicador: "Total Facturado",
        valor: totalFacturado,
    });


    resumen.getColumn("valor").numFmt = "0";
    resumen.getCell("B3").numFmt = "#,##0.00";
    resumen.getCell("B4").numFmt = "#,##0.00";

    styleHeaderAt(resumen, 1);
    styleDataBody(resumen, 2);

    /* ================= CONTACTOS ================= */

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
            nombre: c.name ?? "",
            tel: prefix
                ? `+${prefix} ${c.numberPhone ?? ""}`
                : c.numberPhone ?? "",
            email: c.email ?? "",
            cliente: Number(c.customerId),
        });
    });

    styleDataBody(contactosSheet, 2);

    /* ================= CLIENTES ================= */

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

    /* ================= FACTURADO ================= */

    const sheet = workbook.addWorksheet("FACTURADO");

    sheet.columns = [
        { header: "Caso", key: "caso", width: 10 },
        { header: "Código del cliente", key: "codCliente", width: 22 },
        { header: "Cliente", key: "cliente", width: 28 },
        { header: "País", key: "pais", width: 18 },
        { header: "Ciudad", key: "ciudad", width: 18 },
        { header: "Encargado", key: "user", width: 30 },
        { header: "Fecha creación", key: "fechaCreacion", width: 20 },
        { header: "Ingeniero", key: "engineering", width: 30 },
        { header: "Estado", key: "state", width: 22 },
        { header: "Línea", key: "line", width: 18 },
        { header: "Producto", key: "category", width: 18 },
        { header: "Prioridad", key: "priority", width: 18 },
        { header: "Origen", key: "origin", width: 18 },
        { header: "Fecha cotización", key: "fechaCotizacion", width: 20 },
        { header: "Codigo de Cotización", key: "cot", width: 22 },
        { header: "Valor cotizado", key: "valorCot", width: 25 },
        { header: "Código OV", key: "ov", width: 14 },
        { header: "Fecha OV", key: "fechaOV", width: 16 },
        { header: "Fecha facturación", key: "fechaFacturacion", width: 22 },
        { header: "Código factura", key: "fac", width: 16 },
        { header: "Valor facturado", key: "valorFac", width: 25 },
        { header: "Contactos", key: "contactos", width: 50 },
        { header: "Observaciones", key: "obs", width: 100 },
    ];

    styleHeaderAt(sheet, 1);
    enableFilterOnHeader(sheet, 1);
    sheet.views = [{ state: "frozen", ySplit: 1 }];

    sheet.getColumn("contactos").alignment = {
        wrapText: true,
        vertical: "top",
    };
    sheet.getColumn("obs").alignment = {
        wrapText: true,
        vertical: "top",
    };

    for (const lead of safeLeads) {
        const customer = usedCustomers.find(
            (c) => String(c.id) === String(lead.customerId)
        );

        const contactosCliente = usedContacts
            .filter((c) => String(c.customerId) === String(lead.customerId))
            .map((c) => {
                const prefix =
                    countryPrefixMap.get(String(customer?.countryId)) ?? "";
                return `Nombre: ${c.name ?? ""}
Correo: ${c.email ?? ""}
Teléfono: ${prefix
                        ? `+${prefix} ${c.numberPhone ?? ""}`
                        : c.numberPhone ?? ""
                    }`;
            })
            .join("\n\n");

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
            state: stateMap.get(String(lead.stateId)) ?? "",
            priority: prioritiesMap.get(String(lead.priorityId)) ?? "",
            fechaCreacion: getActivityDate(lead, 1),
            fechaCotizacion: getActivityDate(lead, 9),
            fechaFacturacion: getActivityDate(lead, 11),
            origin: originMap.get(String(lead.originId)) ?? "",
            cot: Number(lead.cotization),
            valorCot: num(lead.quotedValue),
            ov: Number(lead.codOV),
            fechaOV: dateOnly(lead.dateOV),
            fac: Number(lead.billing),
            valorFac: num(lead.billingValue),
            contactos: contactosCliente || "——",
            obs: lead.observations ?? "",
        });

        const linesCount = (contactosCliente || "").split("\n").length;
        row.height = 20 + linesCount * 15;
    }

    styleDataBody(sheet, 2, [22, 23]);
    styleHeaderAt(sheet, 1);

    /* ================= GUARDAR ================= */

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${fileName}.xlsx`;
    a.click();
    URL.revokeObjectURL(url);
}
