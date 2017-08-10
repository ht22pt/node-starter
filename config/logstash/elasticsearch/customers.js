
import express from 'express';
import elastic from '../core';

const router = express.Router();
const elasticClient = elastic.elasticClient;

const indexName = 'customers';

// customer_id, first_name, last_name, email
const mappingConfig = {
  index: indexName,
  type: 'customer',
  body: {
    properties: {
      customer_id: { type: 'number' },
      first_name: { type: 'string' },
      last_name: { type: 'string' },
      email: { type: 'string' },
      suggest: {
        type: 'completion',
        analyzer: 'simple',
        search_analyzer: 'simple',
      },
    },
  },
};

function addDocument(document) {
  return elasticClient.index({
    index: indexName,
    type: 'customer',
    body: {
      customer_id: document.customer_id,
      first_name: document.first_name,
      last_name: document.last_name,
      email: document.email,
      suggest: {
        input: document.first_name.split(' '),
      },
    },
  });
}

function getSuggestions(input) {
  return elasticClient.suggest({
    index: indexName,
    type: 'customer',
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
}).then(function(result){
  console.log(result);
}).catch(function(err){
  console.log(err);
});
