
# Elasticsearch module

This module will attach elasticsearch to starter with some mapping REST API for search or add more to index.
Structure of this modules:
- **core.js**: contains elasticsearchClient and some support methods for init index
 Config: Need input in enviroment **ELASTIC_URL** to start ELASTIC_URL

- **mapping.js**: it will scan folder routes and mapping all route with filename, if want skip file must input filename in execute array in this file
  Example: filename: user.js, mapping will create /user/....
- ***routes*: folder contains all indexs search of elasticsearch, each files is one index

Structure of one file

Define one index

```javascript
const indexName = user;
```

Define 2 or more methods to search/addmore to index

```javascript
// Get suggest from elasticsearch for this indexName
function getSuggestions(input) {...}

// Add new document to index
function addDocument(document){....}
```

Define route to methods for access from client

```javascript
/* GET suggestions */
router.get('/suggest/:input', (req, res) => {
  getSuggestions(req.params.input).then((result) => { res.json(result) });
});

/* POST document to be indexed */
router.post('/', (req, res) => {
  addDocument(req.body).then((result) => { res.json(result) });
});

// Export for mapping
// It will be path http://host:post/filename/suggest/... or http://host:post/filename 
module.exports = router;

```

Init default data for this index

```javascript
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
        metadata: {
          titleLength: bookTitle.length,
        }
      });
    });
    return Promise.all(promises);
  });
});

```
