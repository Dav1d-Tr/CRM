import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Label from "../../form/Label";
import Input from "../../form/input/InputField";

import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";
import { Hashtag, DollarLineIcon, CalenderIcon } from "../../../icons";


export default function TableBilled({
  leads,
  customers,
}: {
  leads: any[];
  customers: any[];
}) {
  const navigate = useNavigate();

  const rows = useMemo(() => {
    return leads.map((lead) => {
      const customer = customers.find((c) => Number(c.id) === Number(lead.customerId)
      );

      const activity = lead.activities?.find(
        (a: any) => Number(a.activityTypeId) === 11
      );

      const formattedDate = activity
        ? new Date(activity.createdAt).toLocaleDateString("es-CO")
        : "—";

      return {
        id: lead.id,
        customer: customer?.name ?? "Cliente desconocido",
        codeOV: lead.codOV,
        billing: lead.billing ?? "",
        billValue: Number(lead.billingValue ?? 0),
        date: formattedDate,
      };
    });
  }, [leads, customers]);

  const totalFacturado = useMemo(() => {
    return rows.reduce((acc, row) => {
      const value = Number(row.billValue) || 0;
      return acc + value;
    }, 0);
  }, [rows]);

  return (
    <>
      <div className="flex gap-3 items-center w-fit">
        <Label>Total Facturado: </Label>
        <Input
          type="text"
          placeholder="Total Facturado"
          value={totalFacturado.toLocaleString("es-CO")}
          onChange={(value) => value}
        />
      </div>
      <div className="overflow-hidden rounded-xl border border-gray-400 bg-white dark:border-white/[0.05] dark:bg-white/[0.05]">
        <div className="w-full overflow-x-auto md:overflow-visible">
          <Table>
            {/* Header */}
            <TableHeader className="border-b border-gray-600 dark:border-white/[0.80] bg-white dark:bg-gray-950">
              <TableRow>
                <TableCell
                  isHeader
                  className="px-3 py-3 font-semibold text-gray-700 dark:text-white/90"
                >
                  Caso
                </TableCell>

                <TableCell
                  isHeader
                  className="px-3 py-3 font-semibold text-gray-700 dark:text-white/90"
                >
                  Cliente
                </TableCell>

                <TableCell
                  isHeader
                  className="px-3 py-3 font-semibold text-gray-700 dark:text-white/90"
                >
                  Código OV
                </TableCell>

                <TableCell
                  isHeader
                  className="hidden lg:table-cell px-3 py-3 font-semibold text-gray-700 dark:text-white/90"
                >
                  Código Factura
                </TableCell>

                <TableCell
                  isHeader
                  className="px-3 py-3 font-semibold text-gray-700 dark:text-white/90"
                >
                  Total
                </TableCell>

                <TableCell
                  isHeader
                  className="hidden lg:table-cell px-3 py-3 font-semibold text-gray-700 dark:text-white/90"
                >
                  Fecha
                </TableCell>
              </TableRow>
            </TableHeader>

            {/* Body */}
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.2] text-gray-600 dark:text-white/90">
              {rows.map((order) => (
                <TableRow
                  key={order.id}
                  onClick={() => navigate(`/billed/${order.id}`)}
                  className="cursor-pointer hover:bg-gray-50 dark:hover:bg-white/[0.05]"
                >
                  
                  <TableCell className="px-3 py-3 text-sm">
                    <span className="flex gap-1 items-center justify-center">
                      <Hashtag />
                      {order.id}
                    </span>
                  </TableCell>

                  <TableCell className="px-3 py-3 text-sm font-medium text-center">
                    {order.customer}
                  </TableCell>

                  <TableCell className="px-3 py-3 text-sm">
                    <span className="flex gap-1 items-center justify-center">
                      <Hashtag />
                      {order.codeOV}
                    </span>
                  </TableCell>

                  <TableCell className="hidden lg:table-cell px-3 py-3 text-sm">
                    <span className="flex gap-1 items-center justify-center">
                      <Hashtag />
                      {order.billing}
                    </span>
                  </TableCell>

                  <TableCell className="px-3 py-3 text-sm">
                    <span className="flex gap-1 items-center justify-center">
                      <DollarLineIcon />
                      {order.billValue.toLocaleString("es-CO")}
                    </span>
                  </TableCell>

                  <TableCell className="hidden lg:table-cell px-3 py-3 text-sm">
                    <span className="flex gap-1 items-center justify-center">
                      <CalenderIcon />
                      {order.date}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
}
