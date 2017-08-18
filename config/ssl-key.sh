#!/usr/bin/env bash

IN_FOLDER=$1
OUT_FOLDER=$2

SSL_KEY_PRIVATE=$OUT_FOLDER/ssl-key.pem
SSL_KEY_REQUEST=$OUT_FOLDER/ssl-cert.csr
SSL_KEY_CERTIFICATE=$OUT_FOLDER/ssl-cert.pem
SSL_KEY_CONFIG=$IN_FOLDER/ssl-config.cnf

openssl genrsa -out $SSL_KEY_PRIVATE 1024
openssl req -config $SSL_KEY_CONFIG -new -batch -key $SSL_KEY_PRIVATE -out $SSL_KEY_REQUEST
openssl x509 -req -in $SSL_KEY_REQUEST -signkey $SSL_KEY_PRIVATE -out $SSL_KEY_CERTIFICATE
