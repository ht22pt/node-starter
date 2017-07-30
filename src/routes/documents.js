
import express from 'express';

const router = express.Router();
const elastic = require('../elasticsearch');

const indexName = 'randomindex';

/* GET suggestions */
router.get('/suggest/:input', (req, res) => {
  elastic.getSuggestions(indexName, req.params.input).then((result) => { res.json(result)});
});

/* POST document to be indexed */
router.post('/', (req, res) => {
  elastic.addDocument(indexName, req.body).then((result) => { res.json(result) });
});

module.exports = router;
