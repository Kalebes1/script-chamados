require('dotenv').config();

const puppeteer = require('puppeteer');
const axios = require('axios');

(async () => {
  let horaReferencia  = new Date(); // ⏱ Marca o início do script
  console.log('🟢 Monitoramento iniciado às', horaReferencia .toLocaleString());

  while (true) {
    const horaInicio = horaReferencia;
    const horaColeta = new Date();

    try {
      const browser = await puppeteer.launch({ headless: true });
      const page = await browser.newPage();

      await page.goto('https://cfess.sciretech.com.br/principal.asp', {
        waitUntil: 'networkidle2'
      });

      // Login
      await page.type('input[name="usuario"]', process.env.USERNAME);
      await page.type('input[name="senha"]', process.env.PASSWORD);
      await page.click('button.btn.btn-block');
      await page.waitForSelector('.task-contain');

      // Clica no card "SUPORTE TÉCNICO"
      await page.waitForSelector('tr[onclick*="suporte_tecnico"]');
      await page.evaluate(() => {
        const linha = Array.from(document.querySelectorAll('tr')).find(tr =>
          tr.getAttribute('onclick')?.includes('suporte_tecnico')
        );
        if (linha) linha.click();
      });

      // Clica no "Confira aqui"
      await page.waitForSelector('span[onclick*="chamados_consultar.asp"]');
      await page.evaluate(() => {
        const span = Array.from(document.querySelectorAll('span')).find(el =>
          el.getAttribute('onclick')?.includes('chamados_consultar.asp')
        );
        if (span) span.click();
      });

      await page.waitForSelector('th[scope="row"]');

      // Coleta os chamados mais recentes com data e hora
      const novosChamados = await page.evaluate((horaInicialStr) => {
        const chamados = [];
        const linhas = document.querySelectorAll('tr');

        for (const linha of linhas) {
          const colunas = linha.querySelectorAll('th[scope="row"]');
          if (colunas.length < 6) continue;

          const codigo = colunas[0]?.innerText.trim();
          const data = colunas[4]?.innerText.trim();
          const hora = colunas[5]?.innerText.trim();

          if (!data || !hora || !codigo) continue;

          const dataHoraStr = `${data} ${hora}`;
          const dataHoraChamado = new Date(
            dataHoraStr.replace(/(\d{2})\/(\d{2})\/(\d{4})/, '$2/$1/$3')
          );

          const horaInicial = new Date(horaInicialStr);
          if (dataHoraChamado >= horaInicial) {
            chamados.push({ codigo, dataHora: dataHoraStr });
          }
        }

        return chamados;
      }, horaReferencia .toISOString());

      // Envia notificação para cada chamado novo
      for (const chamado of novosChamados) {
        await axios.post('https://api.ultramsg.com/instance118958/messages/chat', {
          token: process.env.API_TOKEN,
          to: process.env.PHONE_NUMBER,
          body: `📢 Novo chamado após o início:\nCódigo: ${chamado.codigo}\nData/hora: ${chamado.dataHora}`
        });
        console.log(`✅ Chamado ${chamado.codigo} (${chamado.dataHora}) notificado.`);
      }

      if (novosChamados.length === 0) {
        console.log(`🔄 Nenhum chamado novo nesta verificação ${horaReferencia .toLocaleTimeString()}.`);
      }

      await browser.close();

      // Atualiza a hora de início para este momento
      horaReferencia = new Date(horaColeta.getTime() + 1); // adiciona 1 ms para não duplicar


      // Aguarda 30 segundos
      await new Promise(resolve => setTimeout(resolve, 30000));

    } catch (error) {
      console.error('❌ Erro:', error.message);
      if (error.response) {
        console.error('🧾 Erro da API:', error.response.data);
      }
    }
  }
})();
