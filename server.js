const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Configurar EJS como view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Servir arquivos estáticos (CSS, JS, Imagens)
app.use(express.static(path.join(__dirname, 'public')));

// Dados simulados para contexto da aplicação
const appData = {
    anoSelecionado: 2023,
    titulo: 'Observatório do Feminicídio'
};

// Rota Principal (Início)
app.get('/', (req, res) => {
    if (req.query.partial) {
        res.render('pages/inicio', { data: appData });
    } else {
        res.render('layout', { page: 'inicio', data: appData });
    }
});

// Outras Rotas do Dashboard
const pages = ['panorama', 'tipos', 'regiao', 'temporal', 'rede', 'publicacoes', 'falhas'];
pages.forEach(page => {
    app.get(`/${page}`, (req, res) => {
        if (req.query.partial) {
            res.render(`pages/${page}`, { data: appData });
        } else {
            res.render('layout', { page: page, data: appData });
        }
    });
});

const db = require('./db');

app.get('/perfil', async (req, res) => {
  try {
    const [
      qPopTotal, 
      qDistTerritorial, 
      qDistEtaria, 
      qRacaCor, 
      qEscolaridade, 
      qRenda, 
      qEstruturaFamiliar
    ] = await Promise.all([
      db.pool.query(`
        SELECT l.municipality_name AS municipio, SUM(f.populacao) AS total_mulheres 
        FROM marts.fct_populacao_municipal f
        JOIN marts.dim_location l ON f.location_sk = l.location_sk
        WHERE f.dimensao = 'sexo_total' AND f.sexo = 'F'
        GROUP BY l.municipality_name;
      `),
      db.pool.query(`
        SELECT l.municipality_name AS municipio, SUM(f.populacao) AS total 
        FROM marts.fct_populacao_municipal f
        JOIN marts.dim_location l ON f.location_sk = l.location_sk
        WHERE f.dimensao = 'sexo_total' AND f.sexo = 'F'
        GROUP BY l.municipality_name;
      `),
      db.pool.query(`
        SELECT l.municipality_name AS municipio, f.categoria AS faixa_etaria, SUM(f.populacao) AS total 
        FROM marts.fct_populacao_municipal f
        JOIN marts.dim_location l ON f.location_sk = l.location_sk
        WHERE f.dimensao = 'sexo_idade' AND f.sexo = 'F'
        GROUP BY l.municipality_name, f.categoria;
      `),
      db.pool.query(`
        SELECT l.municipality_name AS municipio, f.categoria AS raca, SUM(f.populacao) AS total 
        FROM marts.fct_populacao_municipal f
        JOIN marts.dim_location l ON f.location_sk = l.location_sk
        WHERE f.dimensao = 'raca_mulheres' AND f.sexo = 'F'
        GROUP BY l.municipality_name, f.categoria;
      `),
      db.pool.query(`
        SELECT l.municipality_name AS municipio, f.categoria AS nivel_instrucao, SUM(f.quantidade) AS total 
        FROM marts.fct_censo_familias f
        JOIN marts.dim_location l ON f.location_sk = l.location_sk
        WHERE f.dimensao = 'nivel_instrucao'
        GROUP BY l.municipality_name, f.categoria;
      `),
      db.pool.query(`
        SELECT l.municipality_name AS municipio, f.categoria AS faixa_renda, SUM(f.quantidade) AS total 
        FROM marts.fct_cadunico_mulheres f
        JOIN marts.dim_location l ON f.location_sk = l.location_sk
        WHERE f.dimensao = 'renda'
        GROUP BY l.municipality_name, f.categoria;
      `),
      db.pool.query(`
        SELECT l.municipality_name AS municipio, f.categoria AS arranjo_familiar, SUM(f.quantidade) AS total 
        FROM marts.fct_censo_familias f
        JOIN marts.dim_location l ON f.location_sk = l.location_sk
        WHERE f.dimensao = 'composicao'
        GROUP BY l.municipality_name, f.categoria;
      `)
    ]);

    const contextData = {
      ...appData,
      dadosTotal: qPopTotal.rows,
      dadosTerritorio: qDistTerritorial.rows,
      dadosIdade: qDistEtaria.rows,
      dadosRaca: qRacaCor.rows,
      dadosEscolaridade: qEscolaridade.rows,
      dadosRenda: qRenda.rows,
      dadosFamilia: qEstruturaFamiliar.rows
    };

    if (req.query.partial) {
        res.render('pages/perfil', { data: contextData });
    } else {
        res.render('layout', { page: 'perfil', data: contextData });
    }
  } catch (err) {
    console.error("Erro ao carregar os dados de Perfil e Contexto:", err);
    res.status(500).send("Erro interno ao carregar o painel");
  }
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT} - http://localhost:${PORT}`);
});
