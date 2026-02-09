import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "../ui/table";
import { Hashtag } from "../../icons";
import Button from "../ui/button/Button";
import { User } from "../../pages/UsersAdmin";

interface TableUsersProps {
    products: User[];
    onLoad: (user: User) => void;
}

export default function TableUsers({ products, onLoad }: TableUsersProps) {
    return (
        <div className="overflow-hidden rounded-xl border border-gray-500 bg-white dark:bg-white/[0.05]">
            <div className="w-full overflow-x-auto md:overflow-visible">
                <Table>
                    {/* Header */}
                    <TableHeader className="border-b border-gray-500 bg-white dark:bg-gray-950  text-gray-800 dark:text-white/90">
                        <TableRow>
                            <TableCell
                                isHeader
                                className="hidden lg:table-cell px-3 py-3 font-semibold text-gray-700 dark:text-white/90"
                            >
                                Id
                            </TableCell>

                            <TableCell isHeader className="px-3 py-3 font-semibold">
                                Nombre
                            </TableCell>

                            <TableCell isHeader className="px-3 py-3 font-semibold">
                                Apellido
                            </TableCell>

                            <TableCell
                                isHeader
                                className="hidden lg:table-cell px-3 py-3 font-semibold text-gray-700 dark:text-white/90"
                            >
                                Correo
                            </TableCell>

                            <TableCell
                                isHeader
                                className="hidden lg:table-cell px-3 py-3 font-semibold text-gray-700 dark:text-white/90"
                            >
                                Nuemero de Celular
                            </TableCell>

                            <TableCell
                                isHeader
                                className="hidden lg:table-cell px-3 py-3 font-semibold text-gray-700 dark:text-white/90"
                            >
                                Rol De Usuario
                            </TableCell>
                            
                            <TableCell isHeader className="px-3 py-3 font-semibold">
                                Acción
                            </TableCell>
                        </TableRow>
                    </TableHeader>

                    {/* Body */}
                    <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.2] text-gray-600 dark:text-white/90">
                        {products.map((p) => (
                            <TableRow
                                key={p.id}
                                className="cursor-pointer hover:bg-gray-50 dark:hover:bg-white/[0.05]"
                            >
                                {/* ID */}
                                <TableCell className="hidden lg:table-cell px-3 py-3 text-sm text-center font-medium">
                                    <span className="flex gap-1 items-center justify-center">
                                        <Hashtag />
                                        {p.id}
                                    </span>
                                </TableCell>

                                {/* Nombre */}
                                <TableCell className="px-3 py-3 text-sm font-medium text-center">
                                    {p.name}
                                </TableCell>

                                <TableCell className="px-3 py-3 text-sm font-medium text-center">
                                    {p.lastName}
                                </TableCell>

                                <TableCell className="hidden lg:table-cell px-3 py-3 text-sm text-center font-medium">
                                    {p.email}
                                </TableCell>

                                <TableCell className="hidden lg:table-cell px-3 py-3 text-sm text-center font-medium">
                                    {p.numberPhone}
                                </TableCell>

                                <TableCell className="hidden lg:table-cell px-3 py-3 text-sm text-center font-medium">
                                    {p.roleName}
                                </TableCell>

                                {/* Acción */}
                                <TableCell className="px-3 py-3 text-sm flex justify-center">
                                    <Button
                                        type="button"
                                        variant="primary"
                                        onClick={() => onLoad(p)}
                                    >
                                        Cargar
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}

                        {products.length === 0 && (
                            <TableRow>
                                <TableCell className="text-center py-6">
                                    No hay lineas registradas
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
