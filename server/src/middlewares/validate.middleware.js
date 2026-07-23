/**
 * Middleware de validation minimal : vérifie que les champs requis
 * sont présents et non vides dans req.body.
 * @param {string[]} fields
 */
function requireFields(fields) {
  return (req, res, next) => {
    const missing = fields.filter((f) => {
      const val = req.body[f];
      return val === undefined || val === null || val === '';
    });
    if (missing.length > 0) {
      return res.status(400).json({
        error: 'Champs requis manquants',
        fields: missing,
      });
    }
    next();
  };
}

module.exports = { requireFields };
