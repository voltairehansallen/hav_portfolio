const SESSION_TTL_MS = 30 * 60 * 1000; // 30 min d'inactivité = session oubliée
const MAX_TURNS = 20; // limite l'historique pour ne pas faire exploser le coût des appels

const sessions = new Map();

function getHistory(sessionId) {
  const session = sessions.get(sessionId);
  return session ? session.history : [];
}

function appendTurn(sessionId, userMessage, modelReply) {
  const session = sessions.get(sessionId) || { history: [] };

  session.history.push({ role: 'user', parts: [{ text: userMessage }] });
  session.history.push({ role: 'model', parts: [{ text: modelReply }] });

  // Garde uniquement les MAX_TURNS derniers échanges (2 entrées par échange)
  if (session.history.length > MAX_TURNS * 2) {
    session.history = session.history.slice(-MAX_TURNS * 2);
  }

  session.lastActive = Date.now();
  sessions.set(sessionId, session);
}

// Nettoyage périodique des sessions inactives (évite une fuite mémoire)
setInterval(() => {
  const now = Date.now();
  for (const [id, session] of sessions.entries()) {
    if (now - session.lastActive > SESSION_TTL_MS) {
      sessions.delete(id);
    }
  }
}, 5 * 60 * 1000).unref();

module.exports = { getHistory, appendTurn };
