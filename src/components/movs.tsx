import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "./ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import type { Movimentacao } from "@/types/types";
import Pagination from "@/components/PaginationComponent";

interface MovsProps {
  movimentacoes: Movimentacao[] | null;
  itemsPerPage?: number;
}

export default function Movs({ movimentacoes, itemsPerPage = 15 }: MovsProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const currentSlice = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    if (!movimentacoes) return [];
    return movimentacoes.slice(start, start + itemsPerPage);
  }, [currentPage, itemsPerPage, movimentacoes]);

  if (!movimentacoes || movimentacoes.length === 0) return null;
  const totalPages = Math.ceil(movimentacoes.length / itemsPerPage);

  return (
    <div className="w-full">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Data</TableHead>
            <TableHead>Descrição</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Valor</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentSlice.map((mov) => (
            <TableRow key={mov.id}>
              <TableCell>
                {new Intl.DateTimeFormat("pt-BR").format(mov.data)}
              </TableCell>
              <TableCell className="text-sm max-w-3 sm:max-w-none overflow-x-auto">
                {mov.descricao}
              </TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className={cn(
                    "bg-green-500/10 text-green-500",
                    mov.tipo === "saida" && "bg-red-500/10 text-red-500"
                  )}
                >
                  {mov.tipo === "saida" ? "Saída" : "Entrada"}
                </Badge>
              </TableCell>
              <TableCell
                className={cn(
                  mov.tipo === "saida" ? "text-red-500" : "text-green-500"
                )}
              >
                {mov.valor.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {totalPages > 1 && (
        <div className="mt-4 flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      )}
    </div>
  );
}
