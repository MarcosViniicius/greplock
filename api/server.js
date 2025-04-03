const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const TELEGRAM_BOT_TOKEN = "SEU_TOKEN_AQUI"; // Substitua pelo seu token do bot
const TELEGRAM_CHAT_ID = "SEU_CHAT_ID_AQUI"; // Substitua pelo ID do chat

app.post("/send-location", async (req, res) => {
  console.log("📩 Recebendo requisição para /send-location");
  console.log("📌 Body recebido:", req.body);

  try {
    if (
      !req.body ||
      !req.body.latitude ||
      !req.body.longitude ||
      !req.body.maps
    ) {
      console.error("⚠️ Erro: Dados de localização estão faltando!");
      return res
        .status(400)
        .json({ success: false, message: "Dados incompletos" });
    }

    const { latitude, longitude, maps } = req.body;
    console.log(`🌍 Latitude: ${latitude}, Longitude: ${longitude}`);

    const message = `📍 Localização:\nLatitude: ${latitude}\nLongitude: ${longitude}\nMaps: ${maps}`;
    console.log("📤 Enviando para Telegram:", message);

    const telegramResponse = await axios.post(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: "Markdown",
      }
    );

    console.log("✅ Telegram respondeu:", telegramResponse.data);
    res.status(200).json({ success: true, message: "Localização enviada!" });
  } catch (error) {
    console.error(
      "❌ Erro ao enviar localização:",
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

// Exporta a API corretamente para a Vercel
module.exports = app;
