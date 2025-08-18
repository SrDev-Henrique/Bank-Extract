import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { Movimentacao } from "@/types/types";

export interface ExportOptions {
  filename?: string;
  exportAll?: boolean;
  title?: string;
  filterType?: "entrada" | "saida" | "all";
  dateRange?: {
    start: Date;
    end: Date;
  };
}

/**
 * Converte string ISO ou Date para Date válida
 * @param data - String ISO ou objeto Date
 * @returns Date válida ou null se inválida
 */
function parseDate(data: string | Date): Date | null {
  if (data instanceof Date) {
    return Number.isNaN(data.getTime()) ? null : data;
  }

  try {
    const parsed = new Date(data);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  } catch {
    return null;
  }
}

/**
 * Formata data para o padrão brasileiro (dd/mm/yyyy)
 * @param data - String ISO ou objeto Date
 * @returns String formatada ou "Data inválida"
 */
function formatDateToBR(data: string | Date): string {
  const date = parseDate(data);
  if (!date) return "Data inválida";

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

/**
 * Formata valor monetário para o padrão brasileiro (R$ 0,00)
 * @param valor - Valor numérico
 * @returns String formatada em BRL
 */
function formatCurrencyToBR(valor: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(valor);
}

/**
 * Gera nome de arquivo padrão baseado na data atual
 * @returns String no formato movimentacoes_YYYYMMDD_HHMM.pdf
 */
function generateDefaultFilename(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");

  return `movimentacoes_${year}${month}${day}_${hours}${minutes}.pdf`;
}

/**
 * Aplica filtros nas movimentações
 * @param movimentacoes - Lista de movimentações
 * @param options - Opções de filtro
 * @returns Movimentações filtradas
 */
function applyFilters(
  movimentacoes: Movimentacao[],
  options: ExportOptions
): Movimentacao[] {
  let filtered = [...movimentacoes];

  // Filtro por tipo
  if (options.filterType && options.filterType !== "all") {
    filtered = filtered.filter((mov) => mov.tipo === options.filterType);
  }

  // Filtro por intervalo de datas
  if (options.dateRange) {
    const startDate = new Date(options.dateRange.start);
    const endDate = new Date(options.dateRange.end);

    // Normalizar datas para comparação (início/fim do dia)
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 999);

    filtered = filtered.filter((mov) => {
      const movDate = parseDate(mov.data);
      if (!movDate) return false;

      // clone para não mutar o original
      const movClone = new Date(movDate);
      // ajustar pra meio-dia só se for necessário lidar com timezone local (opcional)
      movClone.setHours(12, 0, 0, 0);

      return movClone >= startDate && movClone <= endDate;
    });
  }

  return filtered;
}

/**
 * Calcula totais das movimentações
 * @param movimentacoes - Lista de movimentações
 * @returns Objeto com totais calculados
 */
function calculateTotals(movimentacoes: Movimentacao[]) {
  const totalEntradas = movimentacoes
    .filter((mov) => mov.tipo === "entrada")
    .reduce((sum, mov) => sum + mov.valor, 0);

  const totalSaidas = movimentacoes
    .filter((mov) => mov.tipo === "saida")
    .reduce((sum, mov) => sum + mov.valor, 0);

  const saldo = totalEntradas - totalSaidas;

  return {
    totalEntradas,
    totalSaidas,
    saldo,
    count: movimentacoes.length,
  };
}

/**
 * Exporta movimentações para PDF
 * @param movimentacoes - Lista de movimentações
 * @param options - Opções de exportação
 * @returns Promise que resolve quando o PDF é gerado
 */
export async function exportMovsToPdf(
  movimentacoes: Movimentacao[],
  options: ExportOptions = {}
): Promise<void> {
  try {
    // Aplicar filtros se especificados
    const filteredMovs = applyFilters(movimentacoes, options);

    // Verificar se há dados para exportar
    if (!filteredMovs || filteredMovs.length === 0) {
      throw new Error("Nenhuma movimentação disponível para exportação");
    }

    // Criar instância do jsPDF (portrait, mm, A4 por padrão)
    const doc = new jsPDF();
    // fallback seguro para width/height
    const pageWidth =
      typeof doc.internal.pageSize.getWidth === "function"
        ? doc.internal.pageSize.getWidth()
        : (doc.internal.pageSize as { width: number }).width;
    const pageHeight =
      typeof doc.internal.pageSize.getHeight === "function"
        ? doc.internal.pageSize.getHeight()
        : (doc.internal.pageSize as { height: number }).height;

    // Configurações do documento
    const title = options.title || "Movimentações Financeiras";
    const exportDateTime = new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date());

    // Cabeçalho do documento (primeira página)
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text(title, pageWidth / 2, 20, { align: "center" });

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Exportado em: ${exportDateTime}`, pageWidth / 2, 30, {
      align: "center",
    });

    // Calcular totais para exibir informações de resumo se necessário
    const totals = calculateTotals(filteredMovs);

    // Log dos totais para debugging (pode ser removido em produção)
    console.log("Totais calculados:", totals);

    // Preparar dados para a tabela
    const tableData = filteredMovs.map((mov) => [
      formatDateToBR(mov.data),
      mov.descricao ?? "",
      mov.categoria ?? "",
      mov.tipo === "entrada" ? "Entrada" : "Saída",
      formatCurrencyToBR(mov.valor),
    ]);

    // Calcular startY da tabela com base no yPosition atual
    const startY = 45 + 12;

    // Configurar tabela com autoTable
    autoTable(doc, {
      head: [["Data", "Descrição", "Categoria", "Tipo", "Valor"]],
      body: tableData,
      startY,
      styles: {
        fontSize: 8,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [66, 139, 202], // Azul escuro
        textColor: [255, 255, 255],
        fontStyle: "bold",
      },
      columnStyles: {
        0: { cellWidth: 25, halign: "center" }, // Data
        1: { cellWidth: "auto", halign: "left" }, // Descrição
        2: { cellWidth: 40, halign: "left" }, // Categoria
        3: { cellWidth: 25, halign: "center" }, // Tipo
        4: { cellWidth: 30, halign: "right" }, // Valor
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
      margin: { top: 20, right: 14, bottom: 30, left: 14 }, // bottom espaço para rodapé
      // NOTE: NÃO desenhamos rodapé aqui porque o pageCount pode não ser final.
      // Em vez disso, vamos adicionar rodapés após o autoTable (pós-processamento).
    });

    // --- Pós-processamento: adicionar rodapé "Página X de Y" em todas as páginas ---
    const pageCount =
      typeof doc.internal.getNumberOfPages === "function"
        ? doc.internal.getNumberOfPages()
        : (
            doc as unknown as { getNumberOfPages: () => number }
          ).getNumberOfPages?.() ?? 1;

    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");

      const footerText = `Página ${i} de ${pageCount}`;
      // posicionar 10mm acima da borda inferior
      const footerY = pageHeight - 10;
      doc.text(footerText, pageWidth / 2, footerY, { align: "center" });
    }

    // Gerar nome do arquivo
    const filename = options.filename || generateDefaultFilename();

    // Fazer download do PDF
    doc.save(filename);
  } catch (error) {
    console.error("Erro ao gerar PDF:", error);
    throw error;
  }
}

/**
 * Exporta movimentações para CSV
 * @param movimentacoes - Lista de movimentações
 * @param options - Opções de exportação
 */
export function exportMovsToCSV(
  movimentacoes: Movimentacao[],
  options: ExportOptions = {}
): void {
  try {
    // Aplicar filtros se especificados
    const filteredMovs = applyFilters(movimentacoes, options);

    // Verificar se há dados para exportar
    if (filteredMovs.length === 0) {
      throw new Error("Nenhuma movimentação disponível para exportação");
    }

    // Cabeçalho do CSV
    const headers = ["Data", "Descrição", "Categoria", "Tipo", "Valor"];

    // Converter dados para CSV
    const csvData = [
      headers.join(","), // Linha de cabeçalho
      ...filteredMovs.map((mov) =>
        [
          `"${formatDateToBR(mov.data)}"`,
          `"${(mov.descricao ?? "").replace(/"/g, '""')}"`, // Escapar aspas duplas
          `"${(mov.categoria ?? "").replace(/"/g, '""')}"`,
          `"${mov.tipo === "entrada" ? "Entrada" : "Saída"}"`,
          `"${formatCurrencyToBR(mov.valor)}"`,
        ].join(",")
      ),
    ].join("\n");

    // Criar blob e fazer download
    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");

    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);

      // Gerar nome do arquivo CSV
      const filename = options.filename
        ? options.filename.replace(".pdf", ".csv")
        : generateDefaultFilename().replace(".pdf", ".csv");

      link.setAttribute("download", filename);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  } catch (error) {
    console.error("Erro ao gerar CSV:", error);
    throw error;
  }
}
