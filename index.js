const express = require('express');
const axios = require('axios');
require('dotenv').config();
const app = express();
const PORT = process.env.PORT || 8080;
const cors = require("cors");

// Middleware to parse JSON body
app.use(express.json());
app.use(cors());

// Endpoint to get a quote based on the provided keyword
app.post('/getQuote', async (req, res) => {
  const { keyword } = req.body;
  
  try {
    // Call the ChatGPT API to generate a quote
    const gptResponse = await axios.post('https://api.openai.com/v1/engines/davinci-codex/completions', {
      prompt: `Generate a quote about ${keyword}`,
      max_tokens: 50, // Adjust the max_tokens as per your requirement
      temperature: 0.7, // Adjust the temperature for different levels of randomness (0.2 to 1.0)
      n: 1 // Number of quotes to generate
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    const quote = gptResponse.data.choices[0].text.trim();
    res.json({ quote });
  } catch (error) {
    console.error('Error generating quote:', error);
    res.status(500).json({ error: 'Failed to generate quote' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
