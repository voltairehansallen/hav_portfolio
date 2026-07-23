// Évite de répéter try/catch(next) dans chaque contrôleur async
module.exports = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
