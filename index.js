const express = require('express');
const { Configuration, OpenAIApi } = require('openai');
require('dotenv').config();
const app = express();
const cors = require("cors");
const PORT = process.env.PORT || 8080;

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.use(express.json());
app.use(cors());

app.post('/getQuote', async (req, res) => {
  const { keyword } = req.body;
  // console.log(keyword);

  try {
    const response = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'system', content: `You are a helpful assistant that generates quotes about ${keyword}.` }],
      temperature: 0.7, // Adjust the temperature for different levels of randomness (0.2 to 1.0)
      max_tokens: 100, // Adjust the max_tokens as per your requirement
    });

    const quote = response.data.choices[0].message.content.trim();
    // console.log(quote);
    res.json({ quote });
  } catch (error) {
    console.error('Error generating quote:', error);
    res.status(500).json({ error: 'Failed to generate quote' });
  }
});

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
