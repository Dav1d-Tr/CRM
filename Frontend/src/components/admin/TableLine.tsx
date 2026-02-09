import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Hashtag } from "../../icons";
import Button from "../ui/button/Button";

// Tipos

interface Line {
  id: number;
  name: string;
  status: boolean;
}

interface TableLineProps {
  lines: Line[];
  onLoad: (line: Line) => void;
}

export default function TableLine({ lines, onLoad }: TableLineProps) {

  return (
    <div className="overflow-hidden rounded-xl border border-gray-500 bg-white dark:bg-white/[0.05]">
      <div className="w-full overflow-x-auto md:overflow-visible">
        <Table>
          {/* Header */}
          <TableHeader className="border-b border-gray-500 bg-white dark:bg-gray-950  text-gray-800 dark:text-white/90">
            <TableRow>
              <TableCell isHeader className="px-3 py-3 font-semibold">
                Id
              </TableCell>
              <TableCell isHeader className="px-3 py-3 font-semibold">
                Nombre
              </TableCell>
              <TableCell isHeader className="px-3 py-3 font-semibold">
                Acción
              </TableCell>
            </TableRow>
          </TableHeader>

          {/* Body */}
          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.2] text-gray-600 dark:text-white/90">
            {lines.map((c) => (
              <TableRow
                key={c.id}
                className="cursor-pointer hover:bg-gray-50 dark:hover:bg-white/[0.05]"
              >
                {/* ID */}
                <TableCell className="px-3 py-3 text-sm">
                  <span className="flex gap-1 items-center justify-center">
                    <Hashtag />
                    {c.id}
                  </span>
                </TableCell>

                {/* Nombre */}
                <TableCell className="px-3 py-3 text-sm font-medium text-center">
                  {c.name}
                </TableCell>

                {/* Acción */}
                <TableCell className="px-3 py-3 text-sm flex justify-center">
                  <Button
                    type="button"
                    variant="primary"
                    onClick={() => onLoad(c)}
                  >
                    Cargar
                  </Button>
                </TableCell>
              </TableRow>
            ))}

            {lines.length === 0 && (
              <TableRow>
                <TableCell className="text-center py-6">
                  No hay países registrados
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
