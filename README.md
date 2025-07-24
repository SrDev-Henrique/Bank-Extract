# 🏦 Bank Extract - Controle de Movimentações Bancárias

Uma aplicação web moderna para análise e controle de movimentações bancárias através do upload e processamento de extratos em PDF.

## 📋 Sobre o Projeto

O Bank Extract é uma ferramenta que permite aos usuários fazer upload de extratos bancários em PDF e visualizar suas movimentações de forma organizada e intuitiva. A aplicação processa automaticamente o PDF, extrai as informações de lançamentos e apresenta os dados em uma interface amigável com recursos de filtragem, totalizadores e controle de temas.

## ✨ Funcionalidades

### 🔄 **Upload e Processamento de PDF**

- Upload por drag & drop ou seleção de arquivo
- Processamento automático de extratos bancários em PDF
- Validação de formato e tamanho (máx. 10MB)
- Feedback visual durante o processamento

### 📊 **Visualização de Dados**

- Tabela responsiva com movimentações
- Categorização automática (Entrada/Saída)
- Formatação monetária em Real (BRL)
- Paginação para grandes volumes de dados (15 itens por página)

### 🔍 **Filtros e Busca**

- Filtro por descrição das movimentações
- Busca case-insensitive
- Botão de limpeza rápida do filtro

### 📈 **Totalizadores**

- Cálculo automático de total de entradas
- Cálculo automático de total de saídas
- Indicadores visuais com ícones e cores

### 🎨 **Interface e Tema**

- Tema claro e escuro
- Switch de tema com persistência no localStorage
- Detecção automática da preferência do sistema
- Interface responsiva e moderna

## 🛠️ Tecnologias Utilizadas

### **Frontend**

- **Next.js 15.4.3** - Framework React com App Router
- **React 19.1.0** - Biblioteca para interfaces de usuário
- **TypeScript 5** - Superset tipado do JavaScript
- **Tailwind CSS 4** - Framework CSS utilitário

### **UI/UX**

- **Radix UI** - Componentes primitivos acessíveis
- **Lucide React** - Biblioteca de ícones moderna
- **React Aria Components** - Componentes acessíveis

### **Processamento de Dados**

- **PDF.js (pdfjs-dist)** - Biblioteca para parsing de PDF
- **React Hook Form** - Gerenciamento de formulários
- **Zod** - Validação de esquemas TypeScript

### **Estilização**

- **Class Variance Authority** - Gerenciamento de variantes CSS
- **clsx/classnames** - Utilitários para classes condicionais
- **tailwind-merge** - Merge inteligente de classes Tailwind

## 📋 Pré-requisitos

- **Node.js** 18.0.0 ou superior
- **npm** ou **yarn** ou **pnpm**

## 🚀 Instalação

1. **Clone o repositório**

```bash
git clone https://github.com/seu-usuario/bank-extract.git
cd bank-extract
```

2. **Instale as dependências**

```bash
npm install
# ou
yarn install
# ou
pnpm install
```

3. **Execute o projeto em modo de desenvolvimento**

```bash
npm run dev
# ou
yarn dev
# ou
pnpm dev
```

4. **Acesse a aplicação**

```
http://localhost:3000
```

## 📖 Como Usar

### 1️⃣ **Upload do Extrato**

1. Acesse a aplicação
2. Clique na área de upload ou arraste o arquivo PDF do extrato
3. Aguarde o processamento automático
4. As movimentações serão exibidas automaticamente

### 2️⃣ **Visualização dos Dados**

- **Tabela**: Visualize data, descrição, tipo e valor de cada movimentação
- **Totalizadores**: Veja os totais de entradas (verde) e saídas (vermelho)
- **Paginação**: Navegue entre páginas quando há muitas movimentações

### 3️⃣ **Filtros**

1. Digite no campo "Filtrar por descrição..."
2. Clique em "Filtrar" ou pressione Enter
3. Use "Limpar" para remover o filtro

### 4️⃣ **Controle de Tema**

- Use o switch no canto superior direito
- ☀️ Tema claro / 🌙 Tema escuro
- A preferência é salva automaticamente

## 📁 Estrutura do Projeto

```
src/
├── app/                    # App Router do Next.js
│   ├── globals.css        # Estilos globais e variáveis CSS
│   ├── layout.tsx         # Layout principal da aplicação
│   └── page.tsx           # Página inicial
├── components/            # Componentes React
│   ├── ui/               # Componentes base (Button, Input, etc.)
│   ├── OriginUI/         # Componentes especializados
│   ├── home.tsx          # Componente principal da aplicação
│   ├── movs.tsx          # Tabela de movimentações
│   ├── movs-filter.tsx   # Filtro de movimentações
│   ├── total.tsx         # Totalizadores
│   └── loading.tsx       # Componente de loading
├── hooks/                # Custom hooks
│   ├── use-file-upload.ts # Hook para upload de arquivos
│   └── use-pagination.ts  # Hook para paginação
├── types/                # Definições TypeScript
│   └── types.ts          # Interfaces e tipos
├── utils/                # Utilitários
│   └── parsePdf.ts       # Parser de PDF para extratos
└── lib/                  # Bibliotecas e configurações
    └── utils.ts          # Utilitários gerais
```

## 🔧 Scripts Disponíveis

```bash
# Desenvolvimento com Turbopack
npm run dev

# Build para produção
npm run build

# Iniciar servidor de produção
npm run start

# Executar linter
npm run lint
```

## 📝 Formato de PDF Suportado

A aplicação espera extratos bancários em PDF com o seguinte formato:

- Seção com cabeçalho "Data Lançamentos Valor"
- Linhas no formato: `DD/MM/AAAA DESCRIÇÃO VALOR`
- Valores negativos para saídas, positivos para entradas
- Formato monetário brasileiro (1.234,56)

### Exemplo de linha válida:

```
01/12/2024 PIX RECEBIDO JOÃO SILVA                    1.500,00
02/12/2024 PAGAMENTO CARTÃO DÉBITO SUPERMERCADO       -89,50
```

## 🎯 Funcionalidades Avançadas

### **Processamento Inteligente**

- Remoção automática de linhas de "SALDO DO DIA"
- Parsing robusto com regex otimizada
- Detecção automática de múltiplas páginas
- Tratamento de erros com feedback ao usuário

### **Performance**

- Paginação para grandes volumes
- Memoização com `useMemo` para filtros
- Carregamento sob demanda
- Otimização com Turbopack

### **Acessibilidade**

- Componentes Radix UI acessíveis
- Suporte a leitores de tela
- Navegação por teclado
- Contraste adequado entre temas

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🏗️ Desenvolvido com

- ⚡ **Next.js** - O framework React para produção
- 🎨 **Tailwind CSS** - Framework CSS utilitário
- 📱 **Radix UI** - Componentes acessíveis e customizáveis
- 🔒 **TypeScript** - JavaScript com tipagem estática
- 📄 **PDF.js** - Processamento de PDFs no navegador

---

**📧 Contato:** [Seu Email]  
**🌐 Demo:** [Link da Demo]  
**📚 Documentação:** [Link da Documentação]
