# Documentação de Suporte e Estrutura do Projeto

Este documento destina-se a ser um guia de referência para o desenvolvedor manter, escalar ou consultar o projeto usando ferramentas baseadas em IA (ou trabalhar manualmente). Ele mapeia como os arquivos originais foram separados e qual a lógica por trás da arquitetura atual.

---

## 🏗️ Arquitetura de Pastas e Arquivos

O projeto, que antes consistia em um único e gigante arquivo `dashboard.html`, foi fatorado para uma estrutura modular em Node.js com Express, EJS e comunicação com um banco de dados PostgreSQL:

```text
Observatorio/
│
├── package.json              # Configurações do npm, dependências (express, ejs, pg, dotenv).
├── server.js                 # Ponto de entrada do backend. Configura o Express, as rotas e faz as queries no DB.
├── db.js                     # Configuração do Pool de conexão com o PostgreSQL (NeonDB).
├── .env                      # Arquivo de variáveis de ambiente com credenciais do banco (não versionado).
├── vercel.json               # Configuração de deploy da Vercel para rodar o Express.js como Serverless Function.
├── README.md                 # Visão geral do projeto e instruções de execução.
├── suporte.md                # Este arquivo, focado na parte técnica e estrutural.
│
├── public/                   # Arquivos estáticos servidos diretamente para o navegador.
│   ├── css/
│   │   └── style.css         # Todo o estilo da aplicação (variáveis CSS de cores, fontes, layout).
│   ├── js/
│   │   └── dashboard-charts.js # (Legado/Em transição) Lógica antiga de inicialização com dados mockados.
│   └── images/
│       └── Logo.png          # Logo do projeto.
│
└── views/                    # Templates EJS (HTML que é renderizado pelo servidor).
    ├── layout.ejs            # Template "casca" principal (importa o CSS/JS, Background, Header e conteúdo).
    │
    ├── partials/             # Componentes de interface reaproveitáveis.
    │   ├── head.ejs          # Tags `<head>`, `<title>`, importação do Chart.js e CSS.
    │   └── header.ejs        # Barra superior do site (Menu de navegação e seletor de anos).
    │
    └── pages/                # O conteúdo individual de cada aba (injetado no layout.ejs).
        ├── inicio.ejs
        ├── panorama.ejs
        ├── portas-de-entrada.ejs # Página de Canais de Denúncia (Integrada ao DB NeonDB).
        ├── regiao.ejs
        ├── temporal.ejs
        ├── perfil.ejs        # Exemplo de página conectada ao banco, com filtros dinâmicos e exportação CSV.
        ├── rede.ejs
        └── publicacoes.ejs
```

---

## 🔄 Entendendo o Fluxo e Renderização

### 1. O Servidor (`server.js`) e Banco de Dados (`db.js`)
O Express lida com as requisições GET para as diferentes abas do dashboard. 
O fluxo agora envolve comunicação com o banco de dados:
- Rotas específicas (como `/perfil`) importam o `db.js` e realizam queries no PostgreSQL (usando `Promise.all` para performance quando há múltiplas queries).
- Os resultados do banco são encapsulados em um objeto e passados para o `layout.ejs` (ou renderizados parcialmente se for um carregamento via fetch/AJAX).

### 2. O Layout (`views/layout.ejs`)
Este é o esqueleto do HTML. Nele você encontrará:
- A animação de `bg-orb` no fundo da tela.
- O import do menu fixo superior: `<%- include('partials/header') %>`.
- A injeção dinâmica do conteúdo de cada aba na tag `main`: `<%- include(\`pages/\${page}\`) %>`.

### 3. As Páginas (`views/pages/`)
As páginas são renderizadas pelo servidor Node.js. 
- Em páginas conectadas ao banco de dados (ex: `perfil.ejs`), os dados chegam pela variável local `data` do EJS e são injetados de forma segura em uma tag `<script>` utilizando `<%- JSON.stringify(data) %>`.
- A lógica do `Chart.js` para essas páginas integradas reside *dentro da própria view*, permitindo criar filtros dinâmicos de ano, alternância de visualização (Gráfico/Tabela) e funções de download CSV, substituindo os dados estáticos antigos.

---

## 🎨 Como Modificar o Design (Estilos e Fontes)

Todas as cores, animações e responsividade ficam no **`public/css/style.css`**.
- Para alterar cores globalmente, basta buscar o bloco `:root` no topo do arquivo CSS e ajustar as variáveis HEX:

```css
:root {
    --primary: #3521a4;      /* Roxo forte */
    --primary-dark: #b27ab3; /* Roxo claro do menu superior */
    --bg-dark: #1d1d1b;      /* Fundo escuro total */
    --accent: #c33f49;       /* Acento avermelhado */
    ...
}
```

---

## 🛠️ Dicas para Conversa com a IA

Ao utilizar o ChatGPT/Gemini para manutenções e adições de novas features, basta referenciar arquivos pontualmente usando a lógica desta documentação:
1. **Adicionar nova aba integrada ao DB**: "Crie uma nova rota no `server.js` chamada `'/relatorios'` que faça um `SELECT` na tabela X. Repasse os dados para o template correspondente em `views/pages/relatorios.ejs`."
2. **Atualizar visualização de uma página**: "Acesse a view `views/pages/perfil.ejs` e adicione uma nova tabela de exportação CSV usando a variável `data.meuNovoDado`."
3. **Mudar as configurações do banco**: "As credenciais do NeonDB estão salvas no arquivo local `.env` e são gerenciadas através do `db.js`. O `.env` nunca deve ser compartilhado ou subido para o repositório."