# 🤖 Monitoramento de Chamados com Puppeteer + WhatsApp (UltraMsg)

Este projeto automatiza o login no sistema CFESS (ScireTech), monitora chamados na seção de "Suporte Técnico" e envia notificações via WhatsApp usando a API da UltraMsg.

---

## 🚀 Funcionalidades

- Login automático no portal ScireTech
- Acesso à aba "Suporte Técnico"
- Verificação contínua de novos chamados
- Envio de alertas pelo WhatsApp com código e horário do chamado
- Execução contínua com verificação a cada 30 segundos

---

## 📦 Tecnologias Utilizadas

- Node.js
- Puppeteer
- Axios

---

## ⚙️ Como Usar

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/seu-repositorio.git
cd seu-repositorio
```

### 2 Instale as Depêndencias

```bash
npm install puppeteer axios
```

### 3 Edite as Credenciais

```bash
await page.type('input[name="usuario"]', 'SEU_USUARIO');
await page.type('input[name="senha"]', 'SUA_SENHA');

await axios.post('https://api.ultramsg.com/instanceXXXXX/messages/chat', {
  token: 'SEU_TOKEN_ULTRAMSG',
  to: '+55SEUNUMERO',
  body: `📢 Novo chamado após o início: ...`
});

```
### 4 Execute o Script
```bash
node index.js
```
### 5 Exemplo no Terminal
🟢 Monitoramento iniciado às 14/05/2025, 10:30:22  
✅ Chamado 10293 (14/05/2025 10:32:00) notificado.  
🔄 Nenhum chamado novo nesta verificação 10:35:22.  



