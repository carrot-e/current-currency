# current currency [![status](https://img.shields.io/badge/experimental-100%25-619dce.svg)]()

## Idea
This app is a demo of Socket.io and PHP interaction using RabbitMQ.
Here's how it works:

```
browser --web socket--> nodejs server --> rabbitMQ --> PHP script --> rabbitMQ --> nodejs server --web socket--> browser
```

Pretty complicated, isn't it? :astonished:

## Prerequisites:
- Node and NPM
- PHP
- Composer
- RabbitMQ default installation;

## Demo
To run the app do the following in project root:
```
# start app's backend
npm install

composer update

node index.js

php socket.php

# now start the app frontend
cd frontend

npm install

# serve with hot reload at localhost:8080
npm run dev

```

In your browser go to url `http://localhost:8080`
