
import express from 'express';
import elastic from '../core';

const router = express.Router();
const elasticClient = elastic.elasticClient;

const indexName = 'articles';

const mappingConfig = {
  index: indexName,
  type: 'document',
  body: {
    properties: {
      title: { type: 'string' },
      content: { type: 'string' },
      suggest: {
        type: 'completion',
        analyzer: 'simple',
        search_analyzer: 'simple',
        payloads: true,
      },
    },
  },
};

function addDocument(document) {
  return elasticClient.index({
    index: indexName,
    type: 'document',
    body: {
      title: document.title,
      content: document.content,
      suggest: {
        input: document.title.split(' '),
        output: document.title,
        payload: document.metadata || {}
      },
    },
  });
}

function getSuggestions(input) {
  return elasticClient.suggest({
    index: indexName,
    type: 'document',
    body: {
      docsuggest: {
        text: input,
        completion: {
          field: 'suggest',
          fuzzy: {
            fuzziness: 2,
            min_length: 3,
            prefix_length: 3,
          },
        },
      },
    },
  });
}

/* GET suggestions */
router.get('/suggest/:input', (req, res) => {
  getSuggestions(req.params.input).then((result) => { res.json(result) });
});

/* POST document to be indexed */
router.post('/', (req, res) => {
  addDocument(req.body).then((result) => { res.json(result) });
});

module.exports = router;

// Check init Index and init mapping
elastic.indexExists(indexName).then(function (exists) {
  if (!exists) {
    return elastic.initIndex(indexName).then(function () { return elastic.initMapping(mappingConfig); })
  } else {
    return elastic.initMapping(mappingConfig);
  }
});
