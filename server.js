const express = require("express");
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

// Endpoint para receber localização e enviar ao Telegram
app.post("/send-location", async (req, res) => {
  console.log("Recebendo requisição para /send-location...");
  console.log("Body recebido:", req.body);

  try {
    const { latitude, longitude, maps } = req.body;
    if (!latitude || !longitude || !maps) {
      console.error("Erro: Dados de localização incompletos!");
      return res
        .status(400)
        .json({ success: false, message: "Dados incompletos" });
    }

    const message = `📍 Localização:\nLatitude: ${latitude}\nLongitude: ${longitude}\nMaps: ${maps}`;
    console.log("Enviando mensagem para o Telegram:", message);

    const telegramResponse = await axios.post(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: "Markdown",
      }
    );

    console.log("Resposta do Telegram:", telegramResponse.data);
    res.status(200).json({ success: true, message: "Localização enviada!" });
  } catch (error) {
    console.error(
      "Erro ao enviar localização:",
      error.response ? error.response.data : error.message
    );
    res
      .status(500)
      .json({
        success: false,
        message: "Erro interno ao processar a requisição.",
      });
  }
});

// Rodar na porta 8088 ou na definida pela Vercel
const port = process.env.PORT || 8088;
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
