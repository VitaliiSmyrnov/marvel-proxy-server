const express = require('express');
const axios = require('axios');
const crypto = require('crypto');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3001;

app.get('/api/characters', async (req, res) => {
  try {
    const ts = Date.now().toString();
    const privKey = process.env.MARVEL_PRIVATE_KEY;
    const pubKey = process.env.MARVEL_PUBLIC_KEY;

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
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error(
      'Marvel API Error details:',
      error.response?.data || error.message
    );
    res.status(500).json({
      message: 'Ошибка при запросе к Marvel API',
      details: error.response?.data,
    });
  }
});

app.listen(PORT, () => console.log(`Proxy server running on port ${PORT}`));
