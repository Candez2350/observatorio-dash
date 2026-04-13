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
const pages = ['panorama', 'tipos', 'regiao', 'temporal', 'perfil', 'rede', 'publicacoes', 'falhas'];
pages.forEach(page => {
    app.get(`/${page}`, (req, res) => {
        if (req.query.partial) {
            res.render(`pages/${page}`, { data: appData });
        } else {
            res.render('layout', { page: page, data: appData });
        }
    });
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT} - http://localhost:${PORT}`);
});
