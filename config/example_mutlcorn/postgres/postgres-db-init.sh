#!/bin/sh -e

# Create database
psql --variable=ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL
  CREATE DATABASE "demo";
EOSQL

psql --variable=ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname=demo <<-EOSQL
  CREATE EXTENSION "uuid-ossp";
  CREATE EXTENSION "hstore";
EOSQL

# Create structure table
psql --variable=ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname=demo -a -f "./TABLE-INIT.sql"

# Init data
psql --variable=ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname=demo -a -f "./DATA-INIT.sql"
