
import express from 'express';
import elastic from '../core';

const router = express.Router();
const elasticClient = elastic.elasticClient;

const indexName = 'demo';

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
        search_analyzer: 'simple'
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

// init default index
elastic.indexExists(indexName).then(function (exists) {
  if (exists) {
    return elastic.deleteIndex(indexName);
  }
}).then(function () {
  return elastic.initIndex(indexName).then(function () { return elastic.initMapping(mappingConfig) }).then(function () {
    //Add a few titles for the autocomplete
    //elasticsearch offers a bulk functionality as well, but this is for a different time
    var promises = [
      'Thing Explainer',
      'The Internet Is a Playground',
      'The Pragmatic Programmer',
      'The Hitchhikers Guide to the Galaxy',
      'The Hitchhikers Guide to the Galaxy',
      'Trial of the Clone'
    ].map(function (bookTitle) {
      return addDocument({
        title: bookTitle,
        content: bookTitle + " content",
      });
    });
    return Promise.all(promises);
  });
});

