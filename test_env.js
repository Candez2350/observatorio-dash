
const { JSDOM } = require('jsdom');
const dom = new JSDOM(`
<select id='anoFilterSaude'><option value='todos'></option></select>
<select id='municipioFilterSaude'><option value='todos'></option></select>
<div id='kpiContainerSaude'></div>
<div id='tablesContainerSaude'></div>
<canvas id='chartSinanTipo'></canvas>
<canvas id='chartSinanMeio'></canvas>
<canvas id='chartSinanVitimaIdade'></canvas>
<canvas id='chartSinanVitimaRaca'></canvas>
<canvas id='chartSinanOrientacao'></canvas>
<canvas id='chartSinanVinculo'></canvas>
<canvas id='chartSinanAutorIdade'></canvas>
<canvas id='chartSinanAutorSexo'></canvas>
<canvas id='chartSimCausa'></canvas>
<canvas id='chartSimLocal'></canvas>
<canvas id='chartSimIdade'></canvas>
<canvas id='chartSimRaca'></canvas>
`);
global.window = dom.window;
global.document = dom.window.document;
global.Chart = class { constructor() {} destroy() {} };
require('./test_run.js');

