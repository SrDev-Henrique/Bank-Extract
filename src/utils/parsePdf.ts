/* eslint-disable @typescript-eslint/no-unused-vars */
// src/utils/parsePdf.ts
import {
  getDocument,
  GlobalWorkerOptions,
} from "pdfjs-dist/legacy/build/pdf.mjs";
import type { Movimentacao } from "@/types/types";
import type { TextItem } from "pdfjs-dist/types/src/display/api";
import {
  airbnb,
  massagem,
  siteDeMassagem,
  aluguel,
  roupa,
  sobrancelha,
  mercado,
  autoposto,
  lenco,
  aluguelDeSala,
  costureira,
  limpezaDePele,
  cuidadosDePet,
  receitaFed,
  planoMovel,
  contaDeLuz,
  mei,
  iof,
  parafusos,
  cabeleireiro,
  dizimo,
  farmacia,
  acessorioCelular,
  telefonia,
  contaAgua,
  perfumaria,
  diversos,
  saque,
  cursoOnline,
  loteria,
  podologia,
  causaTrabalhista,
  pedagio,
  juros,
  internet,
  consultaMedica,
  recargaCelular,
  trafegoPago,
  emprestimo,
  cartao,
  alimentacao,
} from "@/lib/text";

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
  const includes = (source: string, text: string[]) => {
    return text.some((t) => source.toLowerCase().includes(t.toLowerCase()));
  };
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await getDocument({ data: arrayBuffer }).promise;

  // Extrai texto de todas as páginas
  const textos: string[] = [];
  for (let i = 1; i <= pdf.numPages; i++) {
    const content = await (await pdf.getPage(i)).getTextContent();
    const pageText = content.items
      .filter(isTextItem)
      .map((t) => t.str)
      .join(" ");
    textos.push(pageText);
  }
  const fullText = textos.join("\n");

  // Remove tudo antes da tabela de lançamentos
  const [, tabelaTexto] = fullText.split(/data\s+lan(?:ç|c)amentos\s+valor/i);

  // Regex com lookahead para parar no próximo DD/MM/YYYY
  const lancamentoRegex =
    /(\d{2}\/\d{2}\/\d{4})\s+(.+?)\s+(-?\d{1,3}(?:\.\d{3})*,\d{2})(?=\s+\d{2}\/\d{2}\/\d{4}|$)/g;

  const movs: Movimentacao[] = Array.from(
    (tabelaTexto || fullText).matchAll(lancamentoRegex)
  )
    .map(([_, dataStr, descRaw, valorStr], idx) => {
      const valor = parseFloat(valorStr.replace(/\./g, "").replace(",", "."));
      const [d, m, y] = dataStr.split("/");
      return {
        id: idx,
        data: new Date(+y, +m - 1, +d),
        descricao: descRaw.trim(),
        valor,
        tipo: valor >= 0 ? ("entrada" as const) : ("saida" as const),
        categoria: includes(descRaw, airbnb)
          ? "Airbnb"
          : includes(descRaw, alimentacao)
          ? "Alimentação"
          : includes(descRaw, massagem)
          ? "Massagem"
          : includes(descRaw, emprestimo)
          ? "Empréstimo"
          : includes(descRaw, cartao)
          ? "Fatura cartão"
          : includes(descRaw, siteDeMassagem)
          ? "Site massagem"
          : includes(descRaw, aluguel)
          ? "Aluguel"
          : includes(descRaw, roupa)
          ? "Roupas"
          : includes(descRaw, sobrancelha)
          ? "Sobrancelha"
          : includes(descRaw, mercado)
          ? "Mercado"
          : includes(descRaw, autoposto)
          ? "Autoposto"
          : includes(descRaw, lenco)
          ? "Lenço"
          : includes(descRaw, aluguelDeSala)
          ? "Aluguel de sala"
          : includes(descRaw, costureira)
          ? "Costureira"
          : includes(descRaw, limpezaDePele)
          ? "Limpeza de pele"
          : includes(descRaw, cuidadosDePet)
          ? "Cuidados de pet"
          : includes(descRaw, receitaFed)
          ? "Receita federal"
          : includes(descRaw, planoMovel)
          ? "Plano móvel"
          : includes(descRaw, contaDeLuz)
          ? "Conta de luz"
          : includes(descRaw, mei)
          ? "MEI"
          : includes(descRaw, iof)
          ? "IOF"
          : includes(descRaw, parafusos)
          ? "Parafusos"
          : includes(descRaw, cabeleireiro)
          ? "Cabeleireiro"
          : includes(descRaw, dizimo)
          ? "Dízimo"
          : includes(descRaw, farmacia)
          ? "Farmácia"
          : includes(descRaw, acessorioCelular)
          ? "Acessório celular"
          : includes(descRaw, telefonia)
          ? "Telefonia"
          : includes(descRaw, contaAgua)
          ? "Conta de água"
          : includes(descRaw, perfumaria)
          ? "Perfumaria"
          : includes(descRaw, diversos)
          ? "Diversos"
          : includes(descRaw, saque)
          ? "Saque"
          : includes(descRaw, cursoOnline)
          ? "Curso online"
          : includes(descRaw, loteria)
          ? "Loteria"
          : includes(descRaw, podologia)
          ? "Podologia"
          : includes(descRaw, causaTrabalhista)
          ? "Causa trabalhista"
          : includes(descRaw, pedagio)
          ? "Pedágio"
          : includes(descRaw, juros)
          ? "Juros"
          : includes(descRaw, internet)
          ? "Internet"
          : includes(descRaw, consultaMedica)
          ? "Consulta médica"
          : includes(descRaw, recargaCelular)
          ? "Recarga celular"
          : includes(descRaw, trafegoPago)
          ? "Trafego pago"
          : "Demais",
      };
    })
    // Remove lançamentos de “SALDO DO DIA”
    .filter((m) => !/SALDO DO DIA/i.test(m.descricao));

  // Debug: quantas linhas extraímos e quais totais
  console.log("Lançamentos capturados:", movs.length);
  const totais = movs.reduce(
    (acc, x) => {
      if (x.valor >= 0) acc.entradas += x.valor;
      else acc.saidas += Math.abs(x.valor);
      return acc;
    },
    { entradas: 0, saidas: 0 }
  );
  console.log("→ Entradas:", totais.entradas, "Saídas:", totais.saidas);

  return movs;
}
