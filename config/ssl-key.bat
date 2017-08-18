#!/usr/bin/env bash

SSL_KEY_PRIVATE=./resources/ssl-keys/privatekey.pem
SSL_KEY_REQUEST=./resources/ssl-keys/certrequest.csr
SSL_KEY_CERTIFICATE=./resources/ssl-keys/certificate.pem
SSL_KEY_CONFIG=./resources/ssl-keys/ssl-config.cnf

openssl genrsa -out $SSL_KEY_PRIVATE 1024
openssl req -config $SSL_KEY_CONFIG -new -batch -key $SSL_KEY_PRIVATE -out $SSL_KEY_REQUEST
openssl x509 -req -in $SSL_KEY_REQUEST -signkey $SSL_KEY_PRIVATE -out $SSL_KEY_CERTIFICATE
