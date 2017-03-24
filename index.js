var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var amqp = require('amqplib/callback_api');

var channel;
amqp.connect('amqp://localhost', function(err, conn) {
    conn.createChannel(function(err, ch) {
        channel = ch;

        ch.assertQueue('converted-queue', {durable: false});
        ch.consume('converted-queue', function(msg) {
            console.log(" [x] Received %s", msg.content.toString());
            msg = msg.content.toString();
            io.emit('converted', JSON.parse(msg));
        }, {noAck: true});
    });
});

io.on('connection', function(socket) {
    console.log('a user connected');

    socket.on('disconnect', function() {
        console.log('user disconnected');
    });

    socket.on('broadcast', function(msg) {
        channel.sendToQueue('user-input-queue', new Buffer(JSON.stringify({msg: msg})));
    });
});

http.listen(4001, function() {
    console.log('listening on *:4001');
});
