/**
 * Exemplos de uso do componente ExportMovsPdf
 *
 * Este arquivo contém exemplos práticos de como usar o componente
 * de exportação de movimentações em diferentes cenários.
 */

import React, { useState } from "react";

import type { Movimentacao } from "@/types/types";

// Lazy import do componente
const ExportMovsPdfComponent = React.lazy(() => import("./ExportMovsPdf"));

// Dados de exemplo para demonstração
const exemploMovimentacoes: Movimentacao[] = [
  {
    id: 1,
    data: new Date("2024-01-15"),
    descricao: "Salário Janeiro",
    valor: 5000.0,
    tipo: "entrada",
    categoria: "Salário",
  },
  {
    id: 2,
    data: new Date("2024-01-16"),
    descricao: "Supermercado - Compras mensais",
    valor: 450.75,
    tipo: "saida",
    categoria: "Alimentação",
  },
  {
    id: 3,
    data: new Date("2024-01-20"),
    descricao: "Freelance - Design gráfico",
    valor: 800.0,
    tipo: "entrada",
    categoria: "Freelance",
  },
  {
    id: 4,
    data: new Date("2024-01-22"),
    descricao: "Conta de luz",
    valor: 185.3,
    tipo: "saida",
    categoria: "Contas",
  },
  {
    id: 5,
    data: new Date("2024-01-25"),
    descricao: "Internet banda larga",
    valor: 99.9,
    tipo: "saida",
    categoria: "Contas",
  },
];

/**
 * Exemplo 1: Uso básico do componente
 */
export function ExemploBasico() {
  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Exemplo Básico</h3>
      <p className="text-gray-600 mb-4">
        Exportação simples com configurações padrão
      </p>

      <React.Suspense fallback={<div>Carregando...</div>}>
        <ExportMovsPdfComponent movimentacoes={exemploMovimentacoes} />
      </React.Suspense>
    </div>
  );
}

/**
 * Exemplo 2: Com opções personalizadas
 */
export function ExemploPersonalizado() {
  const [feedback, setFeedback] = useState<string>("");

  const handleExportStart = () => {
    setFeedback("Iniciando exportação...");
  };

  const handleExportComplete = (success: boolean, error?: string) => {
    if (success) {
      setFeedback("PDF exportado com sucesso!");
    } else {
      setFeedback(`Erro na exportação: ${error}`);
    }

    // Limpar feedback após 3 segundos
    setTimeout(() => setFeedback(""), 3000);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Exemplo Personalizado</h3>
      <p className="text-gray-600 mb-4">
        Com título customizado, filtros e opção CSV
      </p>

      <React.Suspense fallback={<div>Carregando...</div>}>
        <ExportMovsPdfComponent
          movimentacoes={exemploMovimentacoes}
          title="Relatório Financeiro - Janeiro 2024"
          filename="relatorio_janeiro_2024.pdf"
          buttonText="Gerar Relatório"
          showFilters={true}
          showCsvOption={true}
          className="bg-green-600 hover:bg-green-700"
          onExportStart={handleExportStart}
          onExportComplete={handleExportComplete}
        />
      </React.Suspense>

      {feedback && (
        <div
          className={`mt-4 p-3 rounded-md text-sm ${
            feedback.includes("sucesso")
              ? "bg-green-100 text-green-800"
              : feedback.includes("Erro")
              ? "bg-red-100 text-red-800"
              : "bg-blue-100 text-blue-800"
          }`}
        >
          {feedback}
        </div>
      )}
    </div>
  );
}

/**
 * Exemplo 3: Integração com sistema de notificações
 */
export function ExemploComNotificacoes() {
  const [notifications, setNotifications] = useState<string[]>([]);

  const addNotification = (message: string) => {
    setNotifications((prev) => [
      ...prev,
      `${new Date().toLocaleTimeString()}: ${message}`,
    ]);
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Exemplo com Notificações</h3>
      <p className="text-gray-600 mb-4">
        Integração com sistema de notificações da aplicação
      </p>

      <div className="space-y-4">
        <React.Suspense fallback={<div>Carregando...</div>}>
          <ExportMovsPdfComponent
            movimentacoes={exemploMovimentacoes}
            showFilters={true}
            showCsvOption={true}
            onExportStart={() => addNotification("Exportação iniciada")}
            onExportComplete={(success, error) => {
              if (success) {
                addNotification("Arquivo exportado com sucesso");
              } else {
                addNotification(`Falha na exportação: ${error}`);
              }
            }}
          />
        </React.Suspense>

        {/* Painel de notificações */}
        {notifications.length > 0 && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-medium text-gray-900">
                Histórico de Exportações
              </h4>
              <button
                type="button"
                onClick={clearNotifications}
                className="text-sm text-gray-600 hover:text-gray-800"
              >
                Limpar
              </button>
            </div>
            <div className="space-y-1">
              {notifications.map((notification) => (
                <div key={notification} className="text-sm text-gray-600">
                  {notification}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Exemplo 4: Uso programático da função utilitária
 */
export function ExemploFuncaoUtilitaria() {
  const [status, setStatus] = useState<string>("");

  const exportarDiretamente = async () => {
    try {
      setStatus("Exportando...");

      // Importar a função utilitária
      const { exportMovsToPdf } = await import("@/utils/exportMovsToPdf");

      // Usar diretamente sem componente
      await exportMovsToPdf(exemploMovimentacoes, {
        title: "Exportação Programática",
        filename: "exportacao_programatica.pdf",
        filterType: "entrada", // Apenas entradas
      });

      setStatus("Exportado com sucesso!");
    } catch (error) {
      setStatus(
        `Erro: ${error instanceof Error ? error.message : "Erro desconhecido"}`
      );
    }

    setTimeout(() => setStatus(""), 3000);
  };

  const exportarCSV = async () => {
    try {
      setStatus("Exportando CSV...");

      const { exportMovsToCSV } = await import("@/utils/exportMovsToPdf");

      exportMovsToCSV(exemploMovimentacoes, {
        filename: "movimentacoes.csv",
        filterType: "saida", // Apenas saídas
      });

      setStatus("CSV exportado com sucesso!");
    } catch (error) {
      setStatus(
        `Erro: ${error instanceof Error ? error.message : "Erro desconhecido"}`
      );
    }

    setTimeout(() => setStatus(""), 3000);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Uso Programático</h3>
      <p className="text-gray-600 mb-4">
        Usando as funções utilitárias diretamente (sem componente React)
      </p>

      <div className="space-y-3">
        <button
          type="button"
          onClick={exportarDiretamente}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Exportar PDF (Apenas Entradas)
        </button>

        <button
          type="button"
          onClick={exportarCSV}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          Exportar CSV (Apenas Saídas)
        </button>

        {status && (
          <div
            className={`p-3 rounded-md text-sm ${
              status.includes("sucesso")
                ? "bg-green-100 text-green-800"
                : status.includes("Erro")
                ? "bg-red-100 text-red-800"
                : "bg-blue-100 text-blue-800"
            }`}
          >
            {status}
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Exemplo 5: Integração completa em uma página
 */
export function ExemploIntegracaoCompleta() {
  const [movimentacoes, setMovimentacoes] =
    useState<Movimentacao[]>(exemploMovimentacoes);
  const [novaMovimentacao, setNovaMovimentacao] = useState({
    descricao: "",
    valor: "",
    tipo: "entrada" as "entrada" | "saida",
    categoria: "",
  });

  const adicionarMovimentacao = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !novaMovimentacao.descricao ||
      !novaMovimentacao.valor ||
      !novaMovimentacao.categoria
    ) {
      return;
    }

    const nova: Movimentacao = {
      id: Math.max(...movimentacoes.map((m) => m.id)) + 1,
      data: new Date(),
      descricao: novaMovimentacao.descricao,
      valor: parseFloat(novaMovimentacao.valor),
      tipo: novaMovimentacao.tipo,
      categoria: novaMovimentacao.categoria,
    };

    setMovimentacoes((prev) => [nova, ...prev]);
    setNovaMovimentacao({
      descricao: "",
      valor: "",
      tipo: "entrada",
      categoria: "",
    });
  };

  return (
    <div className="space-y-6">
      <div className="p-6 bg-white rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Sistema Completo</h3>

        {/* Formulário para adicionar movimentação */}
        <form
          onSubmit={adicionarMovimentacao}
          className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4"
        >
          <input
            type="text"
            placeholder="Descrição"
            value={novaMovimentacao.descricao}
            onChange={(e) =>
              setNovaMovimentacao((prev) => ({
                ...prev,
                descricao: e.target.value,
              }))
            }
            className="px-3 py-2 border border-gray-300 rounded-md"
          />
          <input
            type="number"
            step="0.01"
            placeholder="Valor"
            value={novaMovimentacao.valor}
            onChange={(e) =>
              setNovaMovimentacao((prev) => ({
                ...prev,
                valor: e.target.value,
              }))
            }
            className="px-3 py-2 border border-gray-300 rounded-md"
          />
          <select
            value={novaMovimentacao.tipo}
            onChange={(e) =>
              setNovaMovimentacao((prev) => ({
                ...prev,
                tipo: e.target.value as "entrada" | "saida",
              }))
            }
            className="px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="entrada">Entrada</option>
            <option value="saida">Saída</option>
          </select>
          <input
            type="text"
            placeholder="Categoria"
            value={novaMovimentacao.categoria}
            onChange={(e) =>
              setNovaMovimentacao((prev) => ({
                ...prev,
                categoria: e.target.value,
              }))
            }
            className="px-3 py-2 border border-gray-300 rounded-md"
          />
          <button
            type="submit"
            className="md:col-span-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Adicionar Movimentação
          </button>
        </form>

        {/* Componente de exportação */}
        <React.Suspense fallback={<div>Carregando...</div>}>
          <ExportMovsPdfComponent
            movimentacoes={movimentacoes}
            title="Relatório Completo de Movimentações"
            showFilters={true}
            showCsvOption={true}
            buttonText="Exportar Relatório"
          />
        </React.Suspense>
      </div>

      {/* Lista de movimentações */}
      <div className="p-6 bg-white rounded-lg shadow">
        <h4 className="font-medium mb-4">
          Movimentações Atuais ({movimentacoes.length})
        </h4>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {movimentacoes.map((mov) => (
            <div
              key={mov.id}
              className="flex justify-between items-center p-3 bg-gray-50 rounded"
            >
              <div>
                <div className="font-medium">{mov.descricao}</div>
                <div className="text-sm text-gray-600">{mov.categoria}</div>
              </div>
              <div
                className={`font-medium ${
                  mov.tipo === "entrada" ? "text-green-600" : "text-red-600"
                }`}
              >
                {mov.tipo === "entrada" ? "+" : "-"}{" "}
                {new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(mov.valor)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Componente principal que renderiza todos os exemplos
export default function ExemplosExportMovsPdf() {
  return (
    <div className="space-y-8 p-8 bg-gray-100 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Exemplos do Componente ExportMovsPdf
        </h1>
        <p className="text-gray-600 mb-8">
          Demonstrações práticas de como usar o componente de exportação de
          movimentações
        </p>

        <div className="space-y-8">
          <ExemploBasico />
          <ExemploPersonalizado />
          <ExemploComNotificacoes />
          <ExemploFuncaoUtilitaria />
          <ExemploIntegracaoCompleta />
        </div>
      </div>
    </div>
  );
}
