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

export default function Movs({
  movimentacoes,
}: {
  movimentacoes: Movimentacao[] | null;
}) {
  if (!movimentacoes) return null;

  return (
    <Table>
      <TableHeader>
        <TableHead>Data</TableHead>
        <TableHead>Descrição</TableHead>
        <TableHead>Tipo</TableHead>
        <TableHead>Valor</TableHead>
      </TableHeader>
      <TableBody>
        {movimentacoes.map((mov) => (
          <TableRow key={mov.id}>
            <TableCell>
              {new Intl.DateTimeFormat("pt-BR").format(mov.data)}
            </TableCell>
            <TableCell>{mov.descricao}</TableCell>
            <TableCell>
              {mov.valor > 0 ? (
                <Badge
                  variant="outline"
                  className="bg-green-500/10 text-green-500"
                >
                  Entrada
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-red-500/10 text-red-500">
                  Saída
                </Badge>
              )}
            </TableCell>
            <TableCell
              className={cn(mov.valor > 0 ? "text-green-500" : "text-red-500")}
            >
              R$ {mov.valor}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
