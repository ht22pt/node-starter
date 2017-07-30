
import elasticsearch from 'elasticsearch';

const elasticClient = new elasticsearch.Client({
  host: process.env.ELASTIC_URL,
  log: 'info',
});

function deleteIndex(index) {
  return elasticClient.indices.delete({
    index: index,
  });
}

function initIndex(index) {
  return elasticClient.indices.create({
    index: index,
  });
}

function indexExists(index) {
  return elasticClient.indices.exists({
    index: index,
  });
}

exports.indexExists = indexExists;
function initMapping(index) {
  return elasticClient.indices.putMapping({
    index: index,
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

function getSuggestions(index, input) {
  return elasticClient.suggest({
    index: index,
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

function addDocument(index, document) {
  return elasticClient.index({
    index: index,
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
