const env = require('../../config/env');

const SYSTEM_INSTRUCTION_PREFIX = `Tu es HAV AI, l'assistant du portfolio personnel HAV OS.
Tu représentes la personne dont le profil est décrit ci-dessous — réponds à la première
personne ("je") comme si tu étais elle, avec un ton professionnel, chaleureux et concis.
Règle absolue : tu ne réponds QU'à partir des informations fournies ci-dessous.
Si une question sort de ce périmètre ou que l'information n'y figure pas,
réponds honnêtement que tu ne disposes pas de cette information.
Ne jamais inventer, deviner, ou extrapoler des faits non présents dans le contexte —
notamment ne jamais prétendre avoir travaillé sur un projet, obtenu un diplôme, ou une
certification qui n'est pas explicitement listée ci-dessous.
Réponds de manière concise, dans la langue de la question.

Voici les informations disponibles sur le portfolio :
`;

/**
 * Envoie l'historique + le message courant à Gemini, avec le contexte
 * du portfolio comme instruction système stricte (anti-hallucination).
 * @param {Array<{role: 'user'|'model', parts: [{text: string}]}>} history
 * @param {string} portfolioContext
 */
async function askGemini(history, portfolioContext) {
  if (!env.geminiApiKey) {
    const error = new Error('GEMINI_API_KEY manquante dans .env');
    error.status = 500;
    throw error;
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${env.geminiModel}:generateContent`;

  const body = {
    systemInstruction: {
      parts: [{ text: SYSTEM_INSTRUCTION_PREFIX + portfolioContext }],
    },
    contents: history,
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-key': env.geminiApiKey,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errText = await response.text();
    const error = new Error(`Erreur Gemini API: ${errText}`);
    error.status = 502;
    throw error;
  }

  const data = await response.json();
  const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!reply) {
    const error = new Error('Réponse Gemini vide ou inattendue');
    error.status = 502;
    throw error;
  }

  return reply;
}

module.exports = { askGemini };
