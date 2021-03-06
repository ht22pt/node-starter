/**
 * Node.js API Starter Kit (https://reactstarter.com/nodejs)
 *
 * Copyright © 2016-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

/* @flow */

import fs from 'fs';
import path from 'path';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import session from 'express-session';
import connectRedis from 'connect-redis';
import flash from 'express-flash';
import i18next from 'i18next';
import i18nextMiddleware, { LanguageDetector } from 'i18next-express-middleware';
import i18nextBackend from 'i18next-node-fs-backend';
import expressGraphQL from 'express-graphql';
import PrettyError from 'pretty-error';
import { printSchema } from 'graphql';
import email from './email';
import redis from './redis';
import passport from './passport';
import schema from './schema';
import DataLoaders from './DataLoaders';
import accountRoutes from './routes/account';
import elasticSearchMapping from './elasticsearch/mapping';
import postgraphql from 'postgraphql';

i18next
  .use(LanguageDetector)
  .use(i18nextBackend)
  .init({
    preload: ['en', 'de'],
    ns: ['common', 'email'],
    fallbackNS: 'common',
    detection: {
      lookupCookie: 'lng',
    },
    backend: {
      loadPath: path.resolve(__dirname, '../locales/{{lng}}/{{ns}}.json'),
      addPath: path.resolve(__dirname, '../locales/{{lng}}/{{ns}}.missing.json'),
    },
  });

const app = express();

app.set('trust proxy', 'loopback');

app.use(cors({
  origin(origin, cb) {
    const whitelist = process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : [];
    cb(null, whitelist.includes(origin));
  },
  credentials: true,
}));

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
  store: new (connectRedis(session))({ client: redis }),
  name: 'sid',
  resave: true,
  saveUninitialized: true,
  secret: process.env.SESSION_SECRET,
}));
app.use(i18nextMiddleware.handle(i18next));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use(accountRoutes);

app.get('/graphql/schema', (req, res) => {
  console.log("test");
  res.type('text/plain').send(printSchema(schema));
});


const gql = express();

const postgresConfig = {
  user: process.env.POSTGRES_USERNAME,
  password: process.env.POSTGRES_PASSWORD,
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT,
  database: process.env.POSTGRES_DATABASE,
};

gql.use(postgraphql(
  postgresConfig,
  process.env.POSTGRAPHQL_SCHEMA, {
    graphiql: true,
    graphqlRoute: '/gql/graphql',
    graphiqlRoute: '/gql/graphiql',
    watchPg: true,
    jwtPgTypeIdentifier: `${process.env.POSTGRAPHQL_SCHEMA}.jwt`,
    jwtSecret: process.env.JWT_SECRET,
    pgDefaultRole: process.env.POSTGRAPHQL_DEFAULT_ROLE,
  }));

app.use(gql);

/*
app.use('/graphql', expressGraphQL(req => ({
  schema,
  context: {
    t: req.t,
    user: req.user,
    ...DataLoaders.create(),
  },
  graphiql: process.env.NODE_ENV !== 'production',
  pretty: process.env.NODE_ENV !== 'production',
  formatError: error => ({
    message: error.message,
    state: error.originalError && error.originalError.state,
    locations: error.locations,
    path: error.path,
  }),
})));
*/

// For eslaticsearch
app.use('/elasticsearch', elasticSearchMapping);

// The following routes are intended to be used in development mode only
if (process.env.NODE_ENV !== 'production') {
  // A route for testing email templates
  app.get('/:email(email|emails)/:template', (req, res) => {
    console.log("Demo");
    const message = email.render(req.params.template, { t: req.t, v: 123 });
    res.send(message.html);
  });

  // A route for testing authentication/authorization
  app.get('/', (req, res) => {
    if (req.user) {
      res.send(`<p>${req.t('Welcome, {{user}}!', { user: req.user.displayName })} (<a href="javascript:fetch('/login/clear', { method: 'POST', credentials: 'include' }).then(() => window.location = '/')">${req.t('log out')}</a>)</p>`);
    } else {
      res.send(`<p>${req.t('Welcome, guest!')} </p>
        <p>(<a href="/login/facebook">${req.t('sign in facebook')}</a>)</p>
        <p>(<a href="/login/google">${req.t('sign in google')}</a>)</p>
        <p>(<a href="/login/twitter">${req.t('sign in twitter')}</a>)</p>`);
    }
  });
}

const pe = new PrettyError();
pe.skipNodeFiles();
pe.skipPackage('express');

app.use((err, req, res, next) => {
  process.stderr.write(pe.render(err));
  next();
});

export default app;
