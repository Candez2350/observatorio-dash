# Documentação de Suporte e Estrutura do Projeto

Este documento destina-a ser um guia de referência para o desenvolvedor manter, escalar ou consultar o projeto usando ferramentas baseadas em IA (ou trabalhar manualmente). Ele mapeia como os arquivos originais foram separados e qual a lógica por trás da arquitetura atual.

---

## 🏗️ Arquitetura de Pastas e Arquivos

O projeto, que antes consistia em um único e gigante arquivo `dashboard.html`, foi fatorado para a seguinte estrutura em Node.js com Express e EJS:

```text
Observatorio/
│
├── package.json              # Configurações do npm, dependências (express, ejs) e scripts (start, dev).
├── server.js                 # Ponto de entrada do backend. Configura o Express, EJS e as rotas.
├── README.md                 # Visão geral do projeto.
├── suporte.md                # Este arquivo, focado na parte técnica e estrutural.
│
├── public/                   # Arquivos estáticos servidos diretamente para o navegador.
│   ├── css/
│   │   └── style.css         # Todo o estilo da aplicação (variáveis CSS de cores, fontes, layout).
│   ├── js/
│   │   └── dashboard-charts.js # Lógica de inicialização e dados de todos os gráficos (Chart.js).
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
        ├── tipos.ejs
        ├── regiao.ejs
        ├── temporal.ejs
        ├── perfil.ejs
        ├── rede.ejs
        └── publicacoes.ejs
```

---

## 🔄 Entendendo o Fluxo e Renderização

### 1. O Servidor (`server.js`)
O Express lida com as requisições GET para as diferentes abas do dashboard. Ele sempre renderiza o arquivo `views/layout.ejs`, mas repassa variáveis essenciais:
- `page`: Nome da página requisitada (ex: `'panorama'`). O layout usará isso para saber qual arquivo incluir em `<main>`.
- `data`: Um objeto de contexto (ex: ano selecionado, título geral), garantindo que dados possam ser repassados dinamicamente para os *partials*.

### 2. O Layout (`views/layout.ejs`)
Este é o esqueleto do HTML. Nele você encontrará:
- A animação de `bg-orb` no fundo da tela.
- O import do menu fixo superior: `<%- include('partials/header') %>`.
- A injeção dinâmica do conteúdo de cada aba na tag `main`: `<%- include(\`pages/\${page}\`) %>`.

### 3. As Páginas (`views/pages/`)
Diferente da versão original com abas escondidas via CSS (`display: none`), cada página agora é carregada independentemente por meio do Node.js. 
- Isso significa que, se você estiver na rota `/panorama`, o servidor envia apenas o conteúdo do `panorama.ejs` dentro do `layout.ejs`. A página é limpa e foca na visualização.
- Todos eles foram limpos dos gatilhos antigos `onclick="switchTab(...)"`, substituídos por navegação via link real: `href="/pagina"`.

---

## 🎨 Como Modificar o Design (Estilos e Fontes)

Todas as cores, animações e responsividade ficam no **`public/css/style.css`**.
- As fontes definidas são **Antenna** (primeira tentativa) e **Rubik** (segunda, importada via CDN do Google).
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

## 📊 Como Modificar os Gráficos

A lógica visual e de inserção de dados do Chart.js vive **inteiramente** no arquivo **`public/js/dashboard-charts.js`**.

**Importante:** Como agora as páginas são carregadas separadamente, os `<canvas>` não ficam mais todos presentes no HTML simultaneamente. Por isso, a inicialização de cada gráfico possui uma trava de segurança.

**Padrão de Segurança para Novos Gráficos:**
Sempre que adicionar ou alterar um gráfico, certifique-se de que o JS verifica se o elemento existe antes de pegar o contexto:
```javascript
const el = document.getElementById('idDoSeuCanvas');
if (!el) return; // <-- Evita erros se a página atual não possuir esse gráfico
const ctx = el.getContext('2d');
```

---

## 🛠️ Dicas para Conversa com a IA

Ao utilizar o ChatGPT/Gemini para manutenções e adições de novas features, basta referenciar arquivos pontualmente usando a lógica desta documentação:
1. **Adicionar nova aba no dashboard**: "Crie uma nova rota no `server.js` chamada `'/relatorios'`, adicione o botão no `views/partials/header.ejs` e crie o template correspondente em `views/pages/relatorios.ejs`."
2. **Atualizar dados de um gráfico**: "Altere os dados mockados no `public/js/dashboard-charts.js` na função `initRegiaoCharts()`, atualizando os arrays de data do gráfico X."
3. **Mudar as cores de uma caixa de informação**: "Acesse `public/css/style.css` e modifique a classe `.data-card`..."