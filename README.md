# Observatório do Feminicídio - Dashboard

Este projeto é a plataforma interativa do **Observatório do Feminicídio do Rio de Janeiro (OFRJ)**. Constitui um instrumento de gestão da informação voltado à integração, sistematização e disponibilização de dados públicos sobre violências contra as mulheres no estado, com o objetivo de qualificar o debate e subsidiar políticas públicas.

## 🚀 Tecnologias Utilizadas

- **Node.js & Express.js**: Para o servidor backend e roteamento das páginas.
- **EJS (Embedded JavaScript)**: Motor de templates (view engine) utilizado para modularizar e renderizar a interface do usuário no lado do servidor.
- **HTML5 & CSS3 (Vanilla)**: Estruturação e estilização do dashboard, com foco em uma interface limpa, moderna e responsiva.
- **Chart.js**: Biblioteca JavaScript para a renderização de gráficos interativos (linhas, barras, pizza, radar, etc.) com os dados do observatório.
- **Fontes**: Utilização primária da fonte **Antenna** (quando disponível no sistema) com fallback para a **Rubik** (via Google Fonts).

## 📋 Estrutura e Funcionalidades

O sistema está dividido em diferentes "páginas" (rotas) que apresentam contextos específicos dos dados:

- **🏠 Início**: Apresentação principal, métricas gerais do ano (ocorrências, mulheres atendidas, medidas protetivas, casos de feminicídio).
- **📊 Panorama**: Visão consolidada dos indicadores (tipos de violência, evolução mensal, distribuição).
- **🔍 Tipos**: Classificação detalhada conforme a Lei Maria da Penha (psicológica, física, sexual).
- **🗺️ Região**: Distribuição geográfica das ocorrências de feminicídio e outras violências contra as mulheres (por Unidade Federativa, incidência por região, taxas por 100 mil habitantes).
- **📈 Temporal**: Série histórica das ocorrências de feminicídio e outras violências contra as mulheres (comparativos de anos anteriores, evolução de feminicídios).
- **👤 Perfil**: Caracterização sociodemográfica das vítimas (faixa etária, escolaridade, ocupação, raça/cor).
- **🤝 Rede**: Rede de atendimento e proteção (Centrais, Delegacias, Casas da Mulher, etc.) e canais de denúncia.
- **📚 Publicações**: Relatórios, anuários, estudos especiais, cartilhas e manuais.

## 🎨 Design e Identidade Visual

O dashboard utiliza uma paleta de cores própria para melhor contraste e leitura dos dados:
- **Cores Base**: Claro (`#f8f8f8`) e Roxo Principal (`#3521a4`).
- **Acentos**: Roxo Escuro (`#b27ab3`), Roxo Claro (`#ceaacf`), Vermelho (`#c33f49`), Rosa Avermelhado (`#d57980`).
- **Texto**: Escuro (`#333333`) para alto contraste no fundo claro.

## ⚙️ Como Executar o Projeto

1. Certifique-se de ter o **Node.js** instalado na sua máquina.
2. Clone o repositório ou navegue até a pasta do projeto:
   ```bash
   cd Observatorio
   ```
3. Instale as dependências:
   ```bash
   npm install
   ```
4. Inicie o servidor em modo de desenvolvimento (usando Nodemon para recarregar automaticamente a cada salvamento):
   ```bash
   npm run dev
   ```
5. Acesse o dashboard no seu navegador através do endereço:
   **http://localhost:3000**
