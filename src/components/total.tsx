import type { Movimentacao } from "@/types/types";
import { BanknoteArrowDown, BanknoteArrowUp } from "lucide-react";

export default function Total({
  movimentacoes,
}: {
  movimentacoes: Movimentacao[] | null;
}) {
  if (!movimentacoes) return null;

  const totais = movimentacoes.reduce(
    (acc, m) => {
      if (m.valor >= 0) acc.entradas += m.valor;
      else acc.saidas += Math.abs(m.valor);
      return acc;
    },
    { entradas: 0, saidas: 0 }
  );

  return (
    <div className="flex flex-col gap-2 bg-foreground/90 p-4 rounded-md max-w-3xl self-center">
      <div className="flex flex-col gap-2 md:flex-row md:items-center">
        <div className="flex items-center gap-2 border border-green-500/20 py-1 px-2 rounded-md">
          <BanknoteArrowUp className="text-green-500" />
          <p className="text-sm text-white">
            Total de entradas:{" "}
            <span className="font-bold text-green-500">
              {totais.entradas.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </span>
          </p>
        </div>
        <div className="flex items-center gap-2 border border-red-500/20 py-1 px-2 rounded-md">
          <BanknoteArrowDown className="text-red-500" />
          <p className="text-sm text-white">
            Total de saídas:{" "}
            <span className="font-bold text-red-500">
              {totais.saidas.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}