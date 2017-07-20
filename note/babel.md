## Debug nodejs with babel source

Package need for star debug babel in vs code

Need install babel in global

```
npm install --global babel
```

```json
  "devDependencies": {
    "babel-cli": "^6.24.1",
    "babel-core": "^6.25.0",
    "babel-eslint": "^7.2.3",
    "babel-plugin-transform-class-properties": "^6.24.1",
    "babel-plugin-transform-export-extensions": "^6.22.0",
    "babel-plugin-transform-flow-strip-types": "^6.22.0",
    "babel-plugin-transform-object-rest-spread": "^6.23.0",
    "babel-plugin-transform-runtime": "^6.23.0",
    "babel-preset-env": "^1.6.0",
    "babel-preset-latest": "^6.24.1",
    "babel-register": "^6.24.1",
  },
```

Settings in .babelrc

```json
{
  "presets": [
    ["env", {
      "targets": {
        "node": "current"
      }
    }],
  ],
  "plugins": [
    "transform-class-properties",
    "transform-export-extensions",
    "transform-flow-strip-types",
    "transform-object-rest-spread"
  ]
}

```

In package.json need add

```json
  "babel": {
    "presets": [
      "es2015"
    ],
    "sourceMaps": true,
    "retainLines": true
  },
```


Configuration for start debug

```json
    {
    "type": "node",
    "request": "launch",
    "name": "Debug Source",
    "program": "${workspaceRoot}/src/server.js",
    "cwd": "${workspaceRoot}",
    "runtimeExecutable": "${workspaceRoot}/node_modules/.bin/babel-node",
    "runtimeArgs": [
      "--nolazy"
    ],
    "sourceMaps": false,
    "env": {
      "CORS_ORIGIN":     "http://localhost:3001,http://localhost:3000",
      "DATABASE_URL":    "postgres://postgres@127.0.0.1:5432/opla_demo1",
      "DATABASE_DEBUG":  "false",
      "REDIS_URL":       "redis://127.0.0.1:6379/0",
      "SESSION_SECRET":  "wZjwhFtzQsd7r87W6AZw45Sm",
      "FACEBOOK_ID":     "749092561958564",
      "FACEBOOK_SECRET": "4fb6c3881d7d9921b0d41c9bab6b7638",
      "GOOGLE_ID":       "536447408233-apfaoam0s2o9auul70bjfotu5b7def18.apps.googleusercontent.com",
      "GOOGLE_SECRET":   "AEBnNpaMxVxVlvNyzJwBdoJw",
      "TWITTER_KEY":     "OcHCaDqUhjXMIIKKjkBIG7EDr",
      "TWITTER_SECRET":  "4svE6BRCdUfUjjloRAX5KNjVZ5qnOsrbTtojmbENAZ5rpjfSyM"
    }
  }
```
