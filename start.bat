set CORS_ORIGIN=http://localhost:3001,http://localhost:3000
set DATABASE_URL=postgres://postgres@127.0.0.1:5432/opla_demo1
set DATABASE_DEBUG=false
set REDIS_URL=redis://127.0.0.1:6379/0
set SESSION_SECRET=wZjwhFtzQsd7r87W6AZw45Sm
set FACEBOOK_ID=749092561958564
set FACEBOOK_SECRET=4fb6c3881d7d9921b0d41c9bab6b7638
set GOOGLE_ID=536447408233-apfaoam0s2o9auul70bjfotu5b7def18.apps.googleusercontent.com
set GOOGLE_SECRET=AEBnNpaMxVxVlvNyzJwBdoJw
set TWITTER_KEY=OcHCaDqUhjXMIIKKjkBIG7EDr
set TWITTER_SECRET=4svE6BRCdUfUjjloRAX5KNjVZ5qnOsrbTtojmbENAZ5rpjfSyM

node ./build/server.js
