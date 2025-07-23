// src/utils/parsePdf.ts
import {
  getDocument,
  GlobalWorkerOptions,
} from "pdfjs-dist/legacy/build/pdf.mjs";
import type { Movimentacao } from "@/types/types";
import type { TextItem } from "pdfjs-dist/types/src/display/api";

// serve o worker local
GlobalWorkerOptions.workerSrc = "/pdf.worker.mjs";

function isTextItem(item: unknown): item is TextItem {
  return (
    typeof item === "object" &&
    item !== null &&
    "str" in item &&
    typeof (item as Record<string, unknown>).str === "string"
  );
}

export async function parsePdf(file: File): Promise<Movimentacao[]> {
  // 1) carrega e extrai texto de todas as páginas
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await getDocument({ data: arrayBuffer }).promise;
  const textos: string[] = [];

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items
      .filter(isTextItem)
      .map((t) => t.str)
      .join(" ");
    textos.push(pageText);
  }

  const text = textos.join("\n");

  // 2) regex global: data + descrição (qualquer coisa) + valor (formato BR)
  const lancamentoRegex =
    /(\d{2}\/\d{2}\/\d{4})\s+(.+?)\s+(-?\d{1,3}(?:\.\d{3})*,\d{2})/g;

  // 3) extrai todos os matches
  const movs: Movimentacao[] = Array.from(text.matchAll(lancamentoRegex))
    .map((match, index) => {
      const [, dataStr, descricaoRaw, valorStr] = match;
      const valor = parseFloat(valorStr.replace(/\./g, "").replace(",", "."));

      return {
        id: index,
        data: new Date(dataStr.split("/").reverse().join("-")),
        descricao: descricaoRaw.trim(),
        valor: valor,
      } as Movimentacao;
    })
    // 4) filtra só lançamentos (descarta SALDO DO DIA)
    .filter((m) => !/SALDO DO DIA/i.test(m.descricao));

  console.log(movs);

  return movs;
}
