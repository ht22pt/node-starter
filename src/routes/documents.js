
import express from 'express';

const router = express.Router();
const elastic = require('../elasticsearch');

/* GET suggestions */
router.get('/suggest/:input', (req, res) => {
  elastic.getSuggestions(req.params.input).then((result) => { res.json(result)});
});

/* POST document to be indexed */
router.post('/', (req, res) => {
  elastic.addDocument(req.body).then((result) => { res.json(result) });
});

module.exports = router;
