Basic example for sync data from postgresql to elasticsearch using logstash


Step 1: Prepare

Some applications need install/download an run first
- PostgreSQL 9.5 or 9.6 [download from here](https://www.postgresql.org/download/)
- Elasticsearch 5.5.1 [download from here](https://www.elastic.co/downloads/elasticsearch)
- Logstash 5.5.1 [download from here](https://www.elastic.co/downloads/logstash)
- JDBC Driver for PostgreSQL, current verion postgresql-42.1.3 working with newest PostgreSQL [download from here](https://jdbc.postgresql.org/download.html)
- Sample database [download from here](http://www.postgresqltutorial.com/postgresql-sample-database/), and follow guide from this page for restore example database

Step 2: Settings

- PostgreSQL start with default configuration **127.0.0.1:5432** with username postgres, password postgres, with one database **dvdrental**
- Elasticsearch start with default configuration **127.0.0.1:9200**, and 
  + index **customers** for store search users base on first name or last name
  + index **films** for store search films base title or description


Step 3: Run logstash

Run node starter for create index mapping before run logstash (logstash do not create index mapping)

See in folder config/logstash/dvdrental all config file in here

```
./logstash -f config/logstash/dvdrental/*.conf
```
Have 4 config in this folder for support load all data to index in first time and each schedule will run with check timer

**Note**: 
  - Logstash will auto create index mapping when not found, but for the best mapping must create with elasticsearch in starter
  - With db must create view with timestamp and suggest(type json)
  - In case sql query too complex can be move to one sql file, and use **statement_filepath**, check in file config for correct path to sql file.

  Example basic completion suggest of elastic search

  ```json
  {
  suggest: {
        input: ["Test", "Demo", "Example"],
  }
  ```
  When elasticsearch send request

  ```bash
  POST films/_search?pretty
  {
    "suggest": {
        "film-suggest" : {
            "prefix" : "Tes",
            "fuzzy" : true,
            "completion" : {
                "field" : "suggest"
            }
        }
    }
}
  ```
  Return will all records have input array match with "Tes", maybe Test, Testing ... and fuzzy will support correct spelling.



