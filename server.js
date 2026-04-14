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
const pages = ['panorama', 'regiao', 'temporal', 'rede', 'publicacoes', 'falhas'];
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

app.get('/portas-de-entrada', async (req, res) => {
  try {
    const [
      qEvolucao190,
      qEvolucao180,
      qMunicipios190,
      qMunicipios180,
      qTipoViolencia190,
      qPerfilVitima,
      qPerfilAgressor,
      qRelacao
    ] = await Promise.all([
      db.pool.query(`
        SELECT reference_date_sk AS data_referencia, ano, mes, COUNT(call_sk) AS qtd_chamadas 
        FROM marts.fct_ligue_190 
        GROUP BY reference_date_sk, ano, mes 
        ORDER BY reference_date_sk ASC;
      `),
      db.pool.query(`
        SELECT ano, SUM(denuncias) AS total_denuncias, SUM(violencias) AS total_violencias 
        FROM marts.fct_disque180_municipal 
        GROUP BY ano 
        ORDER BY ano ASC;
      `),
      db.pool.query(`
        SELECT ano, municipio, COUNT(call_sk) AS qtd_chamadas 
        FROM marts.fct_ligue_190 
        GROUP BY ano, municipio 
        ORDER BY ano DESC, qtd_chamadas DESC;
      `),
      db.pool.query(`
        SELECT ano, municipio, SUM(denuncias) AS total_denuncias 
        FROM marts.fct_disque180_municipal 
        GROUP BY ano, municipio 
        ORDER BY ano DESC, total_denuncias DESC;
      `),
      db.pool.query(`
        SELECT ano, tipo_violencia, COUNT(call_sk) AS qtd_chamadas 
        FROM marts.fct_ligue_190 
        GROUP BY ano, tipo_violencia 
        ORDER BY ano DESC, qtd_chamadas DESC;
      `),
      db.pool.query(`
        SELECT ano, dimensao, categoria, SUM(denuncias) AS total_denuncias 
        FROM marts.fct_disque180_perfil 
        WHERE sujeito = 'vitima' 
        GROUP BY ano, dimensao, categoria
        ORDER BY ano DESC, dimensao ASC, total_denuncias DESC;
      `),
      db.pool.query(`
        SELECT ano, dimensao, categoria, SUM(denuncias) AS total_denuncias 
        FROM marts.fct_disque180_perfil 
        WHERE sujeito = 'agressor' 
        GROUP BY ano, dimensao, categoria
        ORDER BY ano DESC, dimensao ASC, total_denuncias DESC;
      `),
      db.pool.query(`
        SELECT ano, categoria AS relacao, SUM(denuncias) AS total_denuncias 
        FROM marts.fct_disque180_perfil 
        WHERE sujeito = 'relacao' AND dimensao = 'relacao_agressor_vitima' 
        GROUP BY ano, categoria
        ORDER BY ano DESC, total_denuncias DESC;
      `)
    ]);

    const contextData = {
      ...appData,
      evolucao190: qEvolucao190.rows,
      evolucao180: qEvolucao180.rows,
      municipios190: qMunicipios190.rows,
      municipios180: qMunicipios180.rows,
      tipoViolencia190: qTipoViolencia190.rows,
      perfilVitima: qPerfilVitima.rows,
      perfilAgressor: qPerfilAgressor.rows,
      relacaoAgressorVitima: qRelacao.rows
    };

    if (req.query.partial) {
        res.render('pages/portas-de-entrada', { data: contextData });
    } else {
        res.render('layout', { page: 'portas-de-entrada', data: contextData });
    }
  } catch (err) {
    console.error("Erro ao carregar os dados de Portas de Entrada:", err);
    res.status(500).send("Erro interno ao carregar o painel");
  }
});

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
