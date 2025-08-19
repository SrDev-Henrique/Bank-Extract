"use client";

import { useState, useMemo, useEffect } from "react";
import type { Movimentacao } from "@/types/types";
import Movs from "./movs";
import Component from "./OriginUI/file-input";
import Total from "./total";
import MovsFilter from "./movs-filter";
import { Switch } from "./ui/switch";
import { Sun, Moon } from "lucide-react";
import ExportMovsPdf from "./ExportMovsPdf";
import { useToast } from "@/utils/use-toast";

export default function Content() {
  const [movimentacoes, setMovimentacoes] = useState<Movimentacao[] | null>(
    null
  );
  const [filtro, setFiltro] = useState<string>("");
  const [categoryFilter, setCategoryFilter] = useState<string>("Todas");
  const [isDark, setIsDark] = useState(false);

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

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

  const movimentacoesFiltradas = useMemo(() => {
    if (!movimentacoes) return movimentacoes;

    const search = (filtro || "").toLowerCase().trim();
    const category = (categoryFilter || "Todas").toLowerCase().trim(); // já lowercased

    return movimentacoes.filter((mov) => {
      const descricao = (mov.descricao || "").toLowerCase();
      const categoriaMov = (mov.categoria || "").toLowerCase();

      const matchesDescription = !search || descricao.includes(search);
      const matchesCategory =
        !category || category === "todas" || categoriaMov === category;

      return matchesDescription && matchesCategory;
    });
  }, [movimentacoes, filtro, categoryFilter]);

  const handleFilter = (filters: { search: string; category: string }) => {
    setFiltro(filters.search ?? "");
    setCategoryFilter(filters.category ?? "Todas");
  };

  const handleClearFilter = () => {
    setFiltro("");
    setCategoryFilter("Todas");
  };

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  const toast = useToast();

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold">Tema</h3>
        <div className="flex itens-center gap-2">
          <Sun className="size-4" />
          <Switch checked={isDark} onCheckedChange={toggleTheme} />
          <Moon className="size-4" />
        </div>
      </div>

      <Component setMovimentacoes={setMovimentacoes} />
      <ExportMovsPdf
        movimentacoes={movimentacoes}
        title="Relatório Janeiro 2024"
        showFilters={true}
        showCsvOption={true}
        onExportComplete={(success, error) => {
          if (success) {
            toast.success("Exportado com sucesso!");
          } else {
            toast.error(`Erro: ${error}`);
          }
        }}
      />
      <Total movimentacoes={movimentacoesFiltradas} />
      <MovsFilter
        onFilter={handleFilter}
        onClear={handleClearFilter}
        currentFilter={filtro}
        currentCategory={categoryFilter}
      />
      <Movs movimentacoes={movimentacoesFiltradas} />
    </div>
  );
}
