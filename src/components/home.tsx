"use client";

import { useState, useMemo, useEffect } from "react";
import type { Movimentacao } from "@/types/types";
import Movs from "./movs";
import Component from "./OriginUI/file-input";
import Total from "./total";
import MovsFilter from "./movs-filter";
import { Switch } from "./ui/switch";
import { Sun, Moon } from "lucide-react";

export default function Content() {
  const [movimentacoes, setMovimentacoes] = useState<Movimentacao[] | null>(
    null
  );
  const [filtro, setFiltro] = useState<string>("");
  const [isDark, setIsDark] = useState(false);

  // Inicializar tema
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setIsDark(savedTheme === "dark");
    } else {
      const systemDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      setIsDark(systemDark);
    }
  }, []);

  // Aplicar tema
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

  // Filtrar movimentações baseado no filtro aplicado
  const movimentacoesFiltradas = useMemo(() => {
    if (!movimentacoes || !filtro.trim()) {
      return movimentacoes;
    }

    const filtroLowerCase = filtro.toLowerCase().trim();
    return movimentacoes.filter((mov) =>
      mov.descricao.toLowerCase().includes(filtroLowerCase)
    );
  }, [movimentacoes, filtro]);

  const handleFilter = (searchTerm: string) => {
    setFiltro(searchTerm);
  };

  const handleClearFilter = () => {
    setFiltro("");
  };

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Header com switch de tema */}
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold">Tema</h3>
        <div className="flex items-center gap-2">
          <Sun className="size-4" />
          <Switch checked={isDark} onCheckedChange={toggleTheme} />
          <Moon className="size-4" />
        </div>
      </div>

      <Component setMovimentacoes={setMovimentacoes} />
      <Total movimentacoes={movimentacoes} />
      <MovsFilter
        onFilter={handleFilter}
        onClear={handleClearFilter}
        currentFilter={filtro}
      />
      <Movs movimentacoes={movimentacoesFiltradas} />
    </div>
  );
}
