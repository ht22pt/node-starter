
import elasticsearch from 'elasticsearch';

const elasticClient = new elasticsearch.Client({
  host: process.env.ELASTIC_URL,
  log: 'debug',
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
function initMapping(config) {
  return elasticClient.indices.putMapping(config);
}


exports.deleteIndex = deleteIndex;
exports.initIndex = initIndex;
exports.initMapping = initMapping;
exports.elasticClient = elasticClient;
