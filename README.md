# Observatório do Feminicídio - Dashboard

Este projeto é a plataforma interativa do **Observatório do Feminicídio do Rio de Janeiro (OFRJ)**. Constitui um instrumento de gestão da informação voltado à integração, sistematização e disponibilização de dados públicos sobre violências contra as mulheres no estado, com o objetivo de qualificar o debate e subsidiar políticas públicas.

## 🚀 Tecnologias Utilizadas

- **Node.js & Express.js**: Para o servidor backend e roteamento das páginas.
- **PostgreSQL (NeonDB)**: Banco de dados relacional em nuvem, utilizado como fonte da verdade para os indicadores. A comunicação é feita utilizando a biblioteca `pg`.
- **EJS (Embedded JavaScript)**: Motor de templates (view engine) utilizado para modularizar e renderizar a interface do usuário no lado do servidor, permitindo a injeção dos dados do banco nas views.
- **HTML5 & CSS3 (Vanilla)**: Estruturação e estilização do dashboard, com foco em uma interface limpa, moderna e responsiva.
- **Chart.js**: Biblioteca JavaScript para a renderização de gráficos interativos (linhas, barras, pizza, radar, etc.) com os dados do observatório.
- **Fontes**: Utilização primária da fonte **Antenna** (quando disponível no sistema) com fallback para a **Rubik** (via Google Fonts).

## 📋 Estrutura e Funcionalidades

O sistema está dividido em diferentes "páginas" (rotas) que apresentam contextos específicos dos dados. Algumas destas páginas já estão integradas ao banco de dados:

- **🏠 Início**: Apresentação da plataforma e seus pilares.
- **👤 Perfil e Contexto**: Visão consolidada dos indicadores e perfil sociodemográfico das vítimas. **(Integrado ao DB com filtros e exportação)**
- **🚪 Portas de Entrada**: Análise dos canais de denúncia (Ligue 190 e Disque 180) e perfil de envolvidos. **(Integrado ao DB com filtros dinâmicos)**
- **🤝 Rede Especializada**: Dados sobre os serviços especializados de atendimento.
- **🆘 Apoio e Assistência**: Informações sobre a rede de assistência social e apoio psicossocial.
- **🏥 Cuidado e Saúde**: Indicadores relacionados ao atendimento de saúde para vítimas de violência.
- **🛡️ Proteção e Segurança**: Dados sobre medidas protetivas e o sistema de segurança pública.
- **⚖️ Direitos e Justiça**: Informações sobre o percurso no sistema de justiça.
- **⚠️ Falhas na Rede**: Análise de gargalos, descontinuidades e pontos críticos no atendimento.

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
4. Crie um arquivo `.env` na raiz do projeto contendo as credenciais de acesso ao banco de dados:
   ```env
   DB_USER=seu_usuario
   DB_PASSWORD=sua_senha
   DB_HOST=seu_host_do_neon.tech
   DB_NAME=nome_do_banco
   DB_PORT=5432
   ```
5. Inicie o servidor em modo de desenvolvimento (usando Nodemon para recarregar automaticamente a cada salvamento):
   ```bash
   npm run dev
   ```
6. Acesse o dashboard no seu navegador através do endereço:
   **http://localhost:3000**

## ☁️ Deploy no Vercel

O projeto já está configurado para ser implantado na Vercel utilizando uma *Serverless Function*.

1. Certifique-se de que o arquivo `vercel.json` está presente na raiz do projeto. Ele direciona todo o tráfego do Express para o Vercel.
2. Ao realizar o deploy no painel da Vercel, acesse **Settings > Environment Variables**.
3. Adicione todas as chaves e valores presentes no seu arquivo local `.env` (`DB_USER`, `DB_PASSWORD`, `DB_HOST`, `DB_NAME`, `DB_PORT`).
4. Realize o deploy. O Vercel fará a renderização das páginas EJS e se comunicará perfeitamente com o NeonDB de forma segura.

