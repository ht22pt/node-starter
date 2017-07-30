
import elasticsearch from 'elasticsearch';

const elasticClient = new elasticsearch.Client({
  host: process.env.ELASTIC_URL,
  log: 'info',
});

const indexName = 'randomindex';

function deleteIndex() {
  return elasticClient.indices.delete({
    index: indexName,
  });
}

function initIndex() {
  return elasticClient.indices.create({
    index: indexName,
  });
}

function indexExists() {
  return elasticClient.indices.exists({
    index: indexName,
  });
}

exports.indexExists = indexExists;
function initMapping() {
  return elasticClient.indices.putMapping({
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
          fuzzy: true,
        },
      },
    },
  });
}

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

exports.deleteIndex = deleteIndex;
exports.initIndex = initIndex;
exports.initMapping = initMapping;
exports.addDocument = addDocument;
exports.getSuggestions = getSuggestions;
