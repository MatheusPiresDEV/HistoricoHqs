const express = require('express');
const router = express.Router();
router.post('/verificar-senha', (req, res) => {
  const { senha } = req.body;
  res.json({ valido: senha === 'mathe0us' });
});
module.exports = router;
