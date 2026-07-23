const crypto = require('crypto');
const asyncHandler = require('../../utils/asyncHandler');
const { buildPortfolioContext } = require('./context.builder');
const { askGemini } = require('./gemini.client');
const sessionStore = require('./session-store');

const chat = asyncHandler(async (req, res) => {
  const { message } = req.body;
  const sessionId = req.body.sessionId || crypto.randomUUID();

  const history = sessionStore.getHistory(sessionId);
  const portfolioContext = await buildPortfolioContext();

  const fullHistory = [...history, { role: 'user', parts: [{ text: message }] }];
  const reply = await askGemini(fullHistory, portfolioContext);

  sessionStore.appendTurn(sessionId, message, reply);

  res.json({ sessionId, reply });
});

module.exports = { chat };
