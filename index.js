var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var amqp = require('amqplib/callback_api');

var channel,
    userInputQueue = 'user-input-queue',
    convertedQueue = 'converted-queue';

amqp.connect('amqp://localhost', function(err, conn) {
    conn.createChannel(function(err, ch) {
        channel = ch;

        ch.assertQueue(convertedQueue, {durable: false});
        ch.consume(convertedQueue, function(msg) {
            msg = msg.content.toString();
            console.log(" [x] Received %s", msg);
            msg = JSON.parse(msg);
            io.to(msg.clientId).emit('converted', msg);
        }, {noAck: true});
    });
});

io.on('connection', function(socket) {
    console.log('a user connected', socket.id);

    socket.on('disconnect', function() {
        console.log('user disconnected');
    });

    socket.on('broadcast', function(msg) {
        msg.clientId = socket.id;
        msg = JSON.stringify(msg);
        console.log(" [x] Sending %s", msg);
        channel.sendToQueue(userInputQueue, new Buffer(msg));
    });
});

http.listen(4001, function() {
    console.log('listening on *:4001');
});
