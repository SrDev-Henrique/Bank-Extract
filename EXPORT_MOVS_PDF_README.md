# Componente ExportMovsPdf

Componente React TypeScript completo para exportação de movimentações financeiras em PDF e CSV, com suporte a filtros, formatação brasileira e múltiplas páginas.

## 📦 Instalação

### Dependências Necessárias

```bash
# NPM
npm install jspdf jspdf-autotable

# Yarn
yarn add jspdf jspdf-autotable

# PNPM
pnpm add jspdf jspdf-autotable
```

### Tipos TypeScript (Opcional)

```bash
# NPM
npm install --save-dev @types/jspdf

# Yarn
yarn add --dev @types/jspdf

# PNPM
pnpm add -D @types/jspdf
```

## 🚀 Uso Básico

### Import do Componente

```tsx
import ExportMovsPdf from "@/components/ExportMovsPdf";
import { Movimentacao } from "@/types/types";
```

### Exemplo Simples

```tsx
const movimentacoes: Movimentacao[] = [
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
    descricao: "Supermercado",
    valor: 450.75,
    tipo: "saida",
    categoria: "Alimentação",
  },
];

function MinhaTelaFinanceira() {
  return (
    <div>
      <h2>Movimentações</h2>

      <ExportMovsPdf movimentacoes={movimentacoes} />
    </div>
  );
}
```

## ⚙️ Props do Componente

| Prop               | Tipo                                         | Padrão                      | Descrição                                           |
| ------------------ | -------------------------------------------- | --------------------------- | --------------------------------------------------- |
| `movimentacoes`    | `Movimentacao[]`                             | **obrigatório**             | Lista de movimentações para exportar                |
| `filename`         | `string`                                     | auto-gerado                 | Nome do arquivo (ex: "relatorio.pdf")               |
| `exportAll`        | `boolean`                                    | `true`                      | Se deve exportar todas as linhas ou apenas visíveis |
| `title`            | `string`                                     | "Movimentações Financeiras" | Título do PDF                                       |
| `buttonText`       | `string`                                     | "Exportar PDF"              | Texto do botão principal                            |
| `className`        | `string`                                     | `""`                        | Classes CSS adicionais para o botão                 |
| `showFilters`      | `boolean`                                    | `false`                     | Se deve mostrar opções de filtro                    |
| `showCsvOption`    | `boolean`                                    | `false`                     | Se deve mostrar botão de exportar CSV               |
| `onExportStart`    | `() => void`                                 | -                           | Callback quando exportação inicia                   |
| `onExportComplete` | `(success: boolean, error?: string) => void` | -                           | Callback quando exportação termina                  |

## 🎯 Exemplos Avançados

### Com Filtros e Callbacks

```tsx
function ExemploAvancado() {
  const [status, setStatus] = useState("");

  return (
    <ExportMovsPdf
      movimentacoes={movimentacoes}
      title="Relatório Mensal - Janeiro 2024"
      filename="relatorio_janeiro_2024.pdf"
      showFilters={true}
      showCsvOption={true}
      buttonText="Gerar Relatório"
      className="bg-green-600 hover:bg-green-700"
      onExportStart={() => setStatus("Gerando relatório...")}
      onExportComplete={(success, error) => {
        if (success) {
          setStatus("Relatório gerado com sucesso!");
        } else {
          setStatus(`Erro: ${error}`);
        }
      }}
    />
  );
}
```

### Uso com Sistema de Notificações

```tsx
import { toast } from "react-toastify"; // ou seu sistema de notificações

function ComNotificacoes() {
  return (
    <ExportMovsPdf
      movimentacoes={movimentacoes}
      showFilters={true}
      showCsvOption={true}
      onExportStart={() => {
        toast.info("Iniciando exportação...");
      }}
      onExportComplete={(success, error) => {
        if (success) {
          toast.success("Arquivo exportado com sucesso!");
        } else {
          toast.error(`Falha na exportação: ${error}`);
        }
      }}
    />
  );
}
```

## 🛠️ Uso das Funções Utilitárias

### Exportação Programática (sem componente React)

```tsx
import { exportMovsToPdf, exportMovsToCSV } from "@/utils/exportMovsToPdf";

// Exportar PDF diretamente
async function exportarPDF() {
  try {
    await exportMovsToPdf(movimentacoes, {
      title: "Relatório Personalizado",
      filename: "meu_relatorio.pdf",
      filterType: "entrada", // apenas entradas
      dateRange: {
        start: new Date("2024-01-01"),
        end: new Date("2024-01-31"),
      },
    });
    console.log("PDF exportado com sucesso!");
  } catch (error) {
    console.error("Erro na exportação:", error);
  }
}

// Exportar CSV diretamente
function exportarCSV() {
  try {
    exportMovsToCSV(movimentacoes, {
      filename: "movimentacoes.csv",
      filterType: "saida", // apenas saídas
    });
    console.log("CSV exportado com sucesso!");
  } catch (error) {
    console.error("Erro na exportação:", error);
  }
}
```

### Opções da Função `exportMovsToPdf`

```typescript
interface ExportOptions {
  filename?: string; // Nome do arquivo
  exportAll?: boolean; // Exportar tudo ou apenas visível
  title?: string; // Título do PDF
  filterType?: "entrada" | "saida" | "all"; // Filtro por tipo
  dateRange?: {
    // Filtro por período
    start: Date;
    end: Date;
  };
}
```

## 🎨 Características do PDF Gerado

### Estrutura do Documento

1. **Cabeçalho**: Título personalizado e data/hora da exportação
2. **Resumo**: Totais de entradas, saídas e saldo final
3. **Tabela**: Movimentações com colunas:
   - Data (formato dd/mm/yyyy)
   - Descrição
   - Categoria
   - Tipo (Entrada/Saída)
   - Valor (formato R$ 0,00)
4. **Rodapé**: Numeração de páginas

### Formatação Brasileira

- **Datas**: Formato `dd/mm/yyyy` (ex: 15/01/2024)
- **Valores**: Formato `R$ 0.000,00` (ex: R$ 1.234,56)
- **Moeda**: Real Brasileiro (BRL)

### Recursos Avançados

- ✅ **Múltiplas páginas** com cabeçalho repetido
- ✅ **Quebra automática** de páginas
- ✅ **Cores alternadas** nas linhas da tabela
- ✅ **Alinhamento otimizado** das colunas
- ✅ **Tratamento de textos longos**

## 📊 Filtros Disponíveis

### Filtro por Tipo

```tsx
// Apenas entradas
filterType: "entrada";

// Apenas saídas
filterType: "saida";

// Todas as movimentações
filterType: "all"; // ou undefined
```

### Filtro por Período

```tsx
dateRange: {
  start: new Date('2024-01-01'),
  end: new Date('2024-01-31')
}
```

## 🔧 Tratamento de Dados

### Conversão Automática de Datas

O componente aceita tanto `Date` quanto strings ISO:

```tsx
// Suportado
{
  data: new Date("2024-01-15");
}
{
  data: "2024-01-15T10:30:00Z";
}
{
  data: "2024-01-15";
}

// Datas inválidas são tratadas como "Data inválida"
```

### Validação de Dados

```tsx
// Array vazio
movimentacoes={[]} // Mostra aviso e desabilita botão

// Dados inválidos são filtrados automaticamente
```

## 🚨 Tratamento de Erros

### Erros Comuns e Soluções

| Erro                              | Causa                                    | Solução                               |
| --------------------------------- | ---------------------------------------- | ------------------------------------- |
| "Nenhuma movimentação disponível" | Array vazio ou filtros muito restritivos | Verificar dados ou ajustar filtros    |
| "Data inválida"                   | Formato de data não reconhecido          | Usar Date ou string ISO válida        |
| "Erro ao gerar PDF"               | Problema na biblioteca jsPDF             | Verificar instalação das dependências |

### Exemplo de Tratamento

```tsx
function ComponenteComTratamento() {
  const [erro, setErro] = useState<string>("");

  return (
    <div>
      <ExportMovsPdf
        movimentacoes={movimentacoes}
        onExportComplete={(success, error) => {
          if (!success) {
            setErro(error || "Erro desconhecido");
            // Log para debugging
            console.error("Falha na exportação:", error);
          } else {
            setErro("");
          }
        }}
      />

      {erro && (
        <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {erro}
        </div>
      )}
    </div>
  );
}
```

## 📱 Acessibilidade

### Recursos de Acessibilidade

- ✅ **ARIA labels** descritivos
- ✅ **Keyboard navigation** completa
- ✅ **Screen reader** friendly
- ✅ **Focus management** adequado
- ✅ **Estados visuais** claros (loading, disabled)

### Exemplos de ARIA

```tsx
// O componente adiciona automaticamente:
aria-label="Exportar PDF - 25 movimentações"
aria-expanded="false" // para botão de filtros
title="Exportar 25 movimentações para PDF"
```

## 🎯 Personalização de Estilos

### Classes CSS Customizáveis

```tsx
<ExportMovsPdf
  movimentacoes={movimentacoes}
  className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg"
/>
```

### Estilos com Tailwind CSS

```tsx
// Botão verde
className = "bg-green-600 hover:bg-green-700";

// Botão grande
className = "px-8 py-4 text-lg";

// Botão com sombra
className = "shadow-lg hover:shadow-xl";
```

## 🔍 Debugging e Logs

### Habilitando Logs de Debug

```tsx
// No arquivo de utilitário, adicione logs:
console.log("Movimentações filtradas:", filteredMovs.length);
console.log("Totais calculados:", totals);
```

### Informações Úteis para Debug

- Total de movimentações originais
- Total após aplicar filtros
- Erros de validação de data
- Tempo de geração do PDF

## ⚡ Performance

### Otimizações Implementadas

- ✅ **Lazy loading** das dependências PDF
- ✅ **Memoização** de cálculos pesados
- ✅ **Processamento assíncrono**
- ✅ **Chunking automático** para arrays grandes

### Recomendações

```tsx
// Para grandes volumes de dados (>1000 items)
// Use filtros para reduzir o tamanho antes da exportação

// Considere paginação no componente pai:
const ITEMS_PER_PAGE = 500;
const currentMovs = movimentacoes.slice(0, ITEMS_PER_PAGE);
```

## 🚀 Limitações Conhecidas

### Limitações do jsPDF

- **Fontes**: Limitado às fontes padrão (Helvetica, Times, etc.)
- **Imagens**: Não suporta SVG nativamente
- **Tabelas complexas**: Limitado pelo autotable

### Limitações do Componente

- **Tamanho máximo**: Recomendado até 5000 movimentações por PDF
- **Filtros**: Processamento client-side apenas
- **Cores**: Limitado a cores sólidas (sem gradientes)

### Soluções Alternativas

```tsx
// Para grandes volumes, implemente paginação:
function ExportacaoComPaginacao() {
  const CHUNK_SIZE = 1000;

  const exportarEmLotes = async () => {
    for (let i = 0; i < movimentacoes.length; i += CHUNK_SIZE) {
      const chunk = movimentacoes.slice(i, i + CHUNK_SIZE);
      await exportMovsToPdf(chunk, {
        filename: `relatorio_parte_${Math.floor(i / CHUNK_SIZE) + 1}.pdf`,
      });
    }
  };

  return <button onClick={exportarEmLotes}>Exportar em Lotes</button>;
}
```

## 📝 Changelog

### v1.0.0

- ✅ Exportação PDF com jsPDF + autotable
- ✅ Exportação CSV nativa
- ✅ Filtros por tipo e data
- ✅ Formatação brasileira completa
- ✅ Múltiplas páginas com cabeçalho
- ✅ Componente React + funções utilitárias
- ✅ TypeScript completo
- ✅ Acessibilidade total
- ✅ Tratamento de erros robusto

## 🤝 Contribuição

Para contribuir com melhorias:

1. Faça fork do projeto
2. Crie uma branch para sua feature
3. Implemente os testes necessários
4. Submeta um pull request

## 📄 Licença

Este componente está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

---

**Desenvolvido com ❤️ para facilitar a exportação de dados financeiros em aplicações React TypeScript.**

