var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

io.on('connection', function(socket) {
    console.log('a user connected');

    socket.on('disconnect', function() {
        console.log('user disconnected');
    });

    socket.on('broadcast', function(msg) {
        console.log(msg);
        io.emit('broadcast', {msg: msg});
    });

    socket.on('converted', function(msg) {
        console.log(msg);
        io.emit('converted', msg);
    });
});

http.listen(4001, function() {
    console.log('listening on *:4001');
});
