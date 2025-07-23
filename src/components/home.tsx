"use client";

import { useState } from "react";
import type { Movimentacao } from "@/types/types";
import Movs from "./movs";
import Component from "./OriginUI/file-input";

export default function Content() {
    const [movimentacoes, setMovimentacoes] = useState<Movimentacao[] | null>(
      null
    );

  return (
    <div className="flex flex-col gap-4 w-full">
      <Component setMovimentacoes={setMovimentacoes} />
      <Movs movimentacoes={movimentacoes} />
    </div>
  );
}