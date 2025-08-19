"use client";

import { useState } from "react";
import { FileDown, Download, Filter } from "lucide-react";
import type { Movimentacao } from "@/types/types";
import {
  exportMovsToPdf,
  exportMovsToCSV,
  type ExportOptions,
} from "@/utils/exportMovsToPdf";

export interface ExportMovsPdfProps {
  /** Lista de movimentações para exportar */
  movimentacoes: Movimentacao[] | null;
  /** Nome do arquivo (opcional, se não fornecido será gerado automaticamente) */
  filename?: string;
  /** Se deve exportar todas as linhas ou apenas as visíveis */
  exportAll?: boolean;
  /** Título do PDF (opcional) */
  title?: string;
  /** Texto do botão (opcional) */
  buttonText?: string;
  /** Classe CSS adicional para o botão */
  className?: string;
  /** Se deve mostrar opções de filtro */
  showFilters?: boolean;
  /** Se deve mostrar opção de exportar CSV */
  showCsvOption?: boolean;
  /** Callback chamado quando a exportação é iniciada */
  onExportStart?: () => void;
  /** Callback chamado quando a exportação é concluída */
  onExportComplete?: (success: boolean, error?: string) => void;
}

/**
 * Componente para exportar movimentações financeiras em PDF ou CSV
 *
 * Características:
 * - Suporte a múltiplas páginas com cabeçalho repetido
 * - Formatação brasileira para datas e valores
 * - Cálculo automático de totais e saldo
 * - Filtros opcionais por tipo e data
 * - Exportação em PDF e CSV
 * - Tratamento de arrays vazios
 * - Acessibilidade completa
 */
export default function ExportMovsPdf({
  movimentacoes,
  filename,
  exportAll = true,
  title,
  buttonText = "Exportar PDF",
  className = "",
  showFilters = false,
  showCsvOption = false,
  onExportStart,
  onExportComplete,
}: ExportMovsPdfProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [filters, setFilters] = useState<{
    type: "all" | "entrada" | "saida";
    dateRange: { start: string; end: string } | null;
  }>({
    type: "all",
    dateRange: null,
  });

  // Calcular quantas movimentações serão exportadas
  const getFilteredCount = (): number => {
    if (!movimentacoes) return 0;
    let filtered = movimentacoes;

    if (filters.type !== "all") {
      filtered = filtered.filter((mov) => mov.tipo === filters.type);
    }

    if (filters.dateRange?.start && filters.dateRange?.end) {
      const startDate = new Date(filters.dateRange.start);
      const endDate = new Date(filters.dateRange.end);

      filtered = filtered.filter((mov) => {
        const movDate = new Date(mov.data);
        return movDate >= startDate && movDate <= endDate;
      });
    }

    return filtered.length;
  };

  const filteredCount = getFilteredCount();

  /**
   * Manipula a exportação para PDF
   */
  const handleExportPdf = async () => {
    if (!movimentacoes) return;
    if (movimentacoes.length === 0) {
      onExportComplete?.(
        false,
        "Nenhuma movimentação disponível para exportação"
      );
      return;
    }

    setIsExporting(true);
    onExportStart?.();

    try {
      const options: ExportOptions = {
        filename,
        exportAll,
        title,
        filterType: filters.type === "all" ? undefined : filters.type,
        dateRange: filters.dateRange
          ? {
              start: new Date(filters.dateRange.start),
              end: new Date(filters.dateRange.end),
            }
          : undefined,
      };

      await exportMovsToPdf(movimentacoes, options);
      onExportComplete?.(true);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Erro desconhecido ao gerar PDF";
      onExportComplete?.(false, errorMessage);
      console.error("Erro na exportação PDF:", error);
    } finally {
      setIsExporting(false);
    }
  };

  /**
   * Manipula a exportação para CSV
   */
  const handleExportCsv = async () => {
    if (!movimentacoes) return;
    if (movimentacoes.length === 0) {
      onExportComplete?.(
        false,
        "Nenhuma movimentação disponível para exportação"
      );
      return;
    }

    setIsExporting(true);
    onExportStart?.();

    try {
      const options: ExportOptions = {
        filename: filename?.replace(".pdf", ".csv"),
        exportAll,
        filterType: filters.type === "all" ? undefined : filters.type,
        dateRange: filters.dateRange
          ? {
              start: new Date(filters.dateRange.start),
              end: new Date(filters.dateRange.end),
            }
          : undefined,
      };

      exportMovsToCSV(movimentacoes, options);
      onExportComplete?.(true);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Erro desconhecido ao gerar CSV";
      onExportComplete?.(false, errorMessage);
      console.error("Erro na exportação CSV:", error);
    } finally {
      setIsExporting(false);
    }
  };

  /**
   * Reseta os filtros
   */
  const resetFilters = () => {
    setFilters({
      type: "all",
      dateRange: null,
    });
  };

  const hasActiveFilters = filters.type !== "all" || filters.dateRange !== null;

  if (!movimentacoes) return null;

  return (
    <div className="space-y-4">
      {/* Botões principais */}
      <div className="flex flex-wrap gap-2 w-full justify-center">
        <button
          type="button"
          onClick={handleExportPdf}
          disabled={isExporting || movimentacoes?.length === 0}
          className={`
            inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg
            transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
            ${
              movimentacoes?.length === 0
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : isExporting
                ? "bg-blue-400 text-white cursor-wait"
                : "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800"
            }
            ${className}
          `}
          aria-label={`${buttonText} - ${filteredCount} movimentações`}
          title={`Exportar ${filteredCount} movimentação${
            filteredCount !== 1 ? "ões" : ""
          } para PDF`}
        >
          <FileDown size={16} className={isExporting ? "animate-bounce" : ""} />
          {isExporting ? "Gerando PDF..." : buttonText}
          {filteredCount > 0 && (
            <span className="text-xs bg-blue-800 px-2 py-1 rounded-full">
              {filteredCount}
            </span>
          )}
        </button>

        {showCsvOption && (
          <button
            type="button"
            onClick={handleExportCsv}
            disabled={isExporting || movimentacoes?.length === 0}
            className={`
              inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border
              transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
              ${
                movimentacoes?.length === 0
                  ? "border-gray-300 text-gray-500 cursor-not-allowed"
                  : isExporting
                  ? "border-green-400 text-green-400 cursor-wait"
                  : "border-green-600 text-green-600 hover:bg-green-50 active:bg-green-100"
              }
            `}
            aria-label={`Exportar CSV - ${filteredCount} movimentações`}
            title={`Exportar ${filteredCount} movimentação${
              filteredCount !== 1 ? "ões" : ""
            } para CSV`}
          >
            <Download
              size={16}
              className={isExporting ? "animate-bounce" : ""}
            />
            {isExporting ? "Gerando CSV..." : "Exportar CSV"}
          </button>
        )}

        {showFilters && (
          <button
            type="button"
            onClick={() => setShowFilterPanel(!showFilterPanel)}
            className={`
              inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border
              transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2
              ${
                hasActiveFilters
                  ? "border-orange-500 text-orange-600 bg-orange-50"
                  : "border-gray-300 text-gray-600 hover:bg-gray-50"
              }
            `}
            aria-label="Configurar filtros de exportação"
            aria-expanded={showFilterPanel}
          >
            <Filter size={16} />
            Filtros
            {hasActiveFilters && (
              <span className="w-2 h-2 bg-orange-500 rounded-full" />
            )}
          </button>
        )}
      </div>

      {/* Informações sobre o estado */}
      <div className="text-sm text-gray-600 w-full flex justify-center">
        {movimentacoes?.length === 0 ? (
          <p className="text-amber-600 font-medium">
            ⚠️ Nenhuma movimentação disponível para exportação
          </p>
        ) : (
          <p>
            {hasActiveFilters ? (
              <>
                <span className="font-medium">{filteredCount}</span> de{" "}
                <span className="font-medium">{movimentacoes?.length}</span>{" "}
                movimentações serão exportadas
                {filteredCount !== movimentacoes?.length && (
                  <span className="text-blue-600"> (filtros aplicados)</span>
                )}
              </>
            ) : (
              <>
                <span className="font-medium">{movimentacoes?.length}</span>{" "}
                movimentaç{movimentacoes?.length !== 1 ? "ões" : "ão"} disponíve
                {movimentacoes?.length !== 1 ? "is" : "l"} para exportação
              </>
            )}
          </p>
        )}
      </div>

      {/* Painel de filtros */}
      {showFilters && showFilterPanel && (
        <div className="border rounded-lg p-4 bg-primary-foreground/90 text-accent-foreground space-y-4">
          <h4 className="font-medium text-primary">Filtros de Exportação</h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Filtro por tipo */}
            <div>
              <label
                htmlFor="filter-type"
                className="block text-sm font-medium text-accent-foreground mb-1"
              >
                Tipo de Movimentação
              </label>
              <select
                id="filter-type"
                value={filters.type}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    type: e.target.value as "all" | "entrada" | "saida",
                  }))
                }
                className="w-full px-3 py-2 border bg-primary-foreground/90 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-accent-foreground"
              >
                <option value="all">Todas</option>
                <option value="entrada">Apenas Entradas</option>
                <option value="saida">Apenas Saídas</option>
              </select>
            </div>

            {/* Filtro por período */}
            <div>
              <label
                htmlFor="filter-date-start"
                className="block text-sm font-medium text-accent-foreground mb-1"
              >
                Período
              </label>
              <div className="flex gap-2">
                <input
                  id="filter-date-start"
                  type="date"
                  value={filters.dateRange?.start || ""}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      dateRange: e.target.value
                        ? {
                            start: e.target.value,
                            end: prev.dateRange?.end || e.target.value,
                          }
                        : null,
                    }))
                  }
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-accent-foreground"
                  aria-label="Data de início"
                />
                <input
                  id="filter-date-end"
                  type="date"
                  value={filters.dateRange?.end || ""}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      dateRange:
                        prev.dateRange?.start && e.target.value
                          ? {
                              start: prev.dateRange.start,
                              end: e.target.value,
                            }
                          : null,
                    }))
                  }
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-accent-foreground"
                  aria-label="Data de fim"
                  min={filters.dateRange?.start}
                />
              </div>
            </div>
          </div>

          {/* Ações dos filtros */}
          <div className="flex justify-between items-center pt-2">
            <button
              type="button"
              onClick={resetFilters}
              disabled={!hasActiveFilters}
              className={`
                text-sm px-3 py-1 rounded transition-colors
                ${
                  hasActiveFilters
                    ? "text-red-600 hover:text-red-700 hover:bg-red-50"
                    : "text-accent-foreground/50 cursor-not-allowed"
                }
              `}
            >
              Limpar Filtros
            </button>

            <span className="text-sm text-accent-foreground">
              {filteredCount} movimentação{filteredCount !== 1 ? "ões" : ""}{" "}
              encontrada{filteredCount !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
