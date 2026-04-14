const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const fs = require('fs');
let html = fs.readFileSync('views/pages/cuidado-e-saude.ejs', 'utf8');

const rawData = { "dadosSinan":[{ano_ocorrencia: 2020}], "dadosSim":[{ano_obito: 2020}], "listaAnos":[2020, 2021], "listaMunicipios":["Rio"] };

html = html.split('<script>')[0] + '<script> var rawSaudeData = ' + JSON.stringify(rawData) + ';' + html.split('</script>')[0].split('<script>')[1].replace(/var rawSaudeData = JSON\.parse.*?%>\`\);/, '') + '</script>';

const dom = new JSDOM(html, { runScripts: "dangerously" });
try {
  dom.window.Chart = class { constructor() {} destroy() {} };
  dom.window.eval('initSaude()');
  console.log("No errors");
} catch(e) {
  console.error("DOM error: ", e);
}
