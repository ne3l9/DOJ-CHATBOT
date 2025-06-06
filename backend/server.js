const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

app.post('/chat', async (req, res) => {
  const { prompt, language, intent } = req.body;

  if (!prompt || !language || !intent) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }

  const langInstruction = {
    en: 'Reply in clear and concise English.',
    hi: 'उत्तर हिंदी में दें। सरल भाषा में समझाएं।',
    or: 'ଉତ୍ତର ସରଳ ଓଡ଼ିଆରେ ଦିଅ।'
  }[language] || 'Reply in English.';

  const systemPrompt = `
You are a government-approved Legal Chatbot developed for the Department of Justice, India.
Your responsibilities:
- Inform users of Indian legal rights, laws, and government schemes.
- Do not offer legal opinions or guess case outcomes.
- Use ${language.toUpperCase()} language.

${langInstruction}
User intent: ${intent}
User message: "${prompt}"

Provide a helpful, respectful, and accurate response within 5 lines.
`;

  try {
    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'mistral',
        prompt: systemPrompt,
        stream: false
      })
    });

    const result = await response.text();
    let reply = '';

    const lines = result.split('\n').filter(l => l.trim());
    for (const line of lines) {
      try {
        const json = JSON.parse(line);
        if (json.response) reply += json.response;
      } catch (e) {
        console.warn('Skipping malformed line:', line);
      }
    }

    res.json({ response: reply.trim() });

  } catch (err) {
    console.error('Fetch error:', err);
    res.status(500).json({ error: 'Something went wrong with the model.' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Backend server is running on http://localhost:${PORT}`);
});
