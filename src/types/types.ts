export interface ExtratoRaw {
  data: string;
  descricao: string;
  valor: string;
}

export interface Movimentacao {
  id: number;
  data: Date;
  descricao: string;
  valor: number;
  tipo: "entrada" | "saida";
  categoria: string;
}
