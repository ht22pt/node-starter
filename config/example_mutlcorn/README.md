This example to init db articles table and elastic search with attach to node starter

## Step 1: Init all tools need for starter

- PostgreSQL database: [download from here](https://www.postgresql.org/download/) (version 9.6 or 9.5)
- Elasticsearch: [download from here](https://www.elastic.co/downloads/elasticsearch) (version 5.5.1)
- Logstash (optional): [download from here](https://www.elastic.co/downloads/logstash) (version 5.5.1)
- ElasticsearchFDW: tool for data wapper from PostgreSQL to Elasticsearch, [download from here](https://github.com/Mikulas/pg-es-fdw)
- postgres-elasticsearch-fdw: (download here)[https://github.com/matthewfranglen/postgres-elasticsearch-fdw]

**Note**: have many data wapper custom base on multicorn.

First step all tools run on default configuration

**PostgreSQL**: Follow guide in download page for start default
- db_name: demo
- username: postgres
- passowrd: postgres

**Elasticsearch**: Follow guide in download page for start default
- path: http://localhost:9200 and 9300

**ElasticsearchFDW**: Using git for clone to prepare download, run command for build and install

* Note: ElasticsearchFDW can't auto create index mapping in elasticsearch, must run starter before insert data

```bash
# Need python 2.7 and pip
cd ElasticsearchFDW
python setup.py build
sudo python setup.py install
```

**postgres-elasticsearch-fdw**

```bash
# Need python 2.7 and pip
cd ElasticsearchFDW
python setup.py build
sudo python setup.py install
```

## Step 2: Init database and add data

Two types for init database, see folder postgres:

1) Run **postgres-db-init.sh** script 
2) Using pgAdmin login to server and create database **demo** and 
- Run script **TABLE-INIT.sql** for create table and some triggers for database
- Run script **DATA-INIT.sql** for insert default data to table

**Without Logstash**

**With Logstash**
Must download jdbc driver for postgres [postgresql-42.1.3.jar](https://jdbc.postgresql.org/download.html)
View folder **logstash** will see one config file, you must change path to **postgresql-42.1.3.jar** same in your computer.

Run command

```bash
cd logstash/bin 
logstash -f logstash-shipper.conf
```

After run this config logstash will write all data in query in config and write to index of elasticsearch

## Step 3: Add elastic search connect to starter

View folder **start_connect**, copy file articles.js to folder src/elasticseach/routes install index search to node starter.

## Step 4: Run some test

- With node starter: run node starter for test

```bash
npm build
node build/server.js
```

And open nodejs url to test, default maybe http://localhost:8080/ and path to elasticsearch will be  http://localhost:8080/articles/suggest/...

- With curl direct to elastic search, default path of elasticsearch http://localhost:9200/articles/_search?q=*:*&pretty or view in folder script_test
