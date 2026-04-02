const express = require('express');
const axios = require('axios');
const crypto = require('crypto');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors()); // Разрешаем фронтенду делать запросы к этому серверу

const PORT = process.env.PORT || 3001;

app.get('/api/characters', async (req, res) => {
  try {
    const ts = Date.now().toString();
    const privKey = process.env.MARVEL_PRIVATE_KEY;
    const pubKey = process.env.MARVEL_PUBLIC_KEY;

    // Создаем MD5 хеш: md5(ts + privateKey + publicKey)
    const hash = crypto
      .createHash('md5')
      .update(ts + privKey + pubKey)
      .digest('hex');

    const response = await axios.get(
      'https://gateway.marvel.com/v1/public/characters',
      {
        params: {
          ts: ts,
          apikey: pubKey,
          hash: hash,
          limit: 20, // можно прокидывать параметры из req.query
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка при запросе к Marvel API' });
  }
});

app.listen(PORT, () => console.log(`Proxy server running on port ${PORT}`));
