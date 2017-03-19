<!doctype html>
<html>
<head>
    <title>current currency</title>
</head>
<body>
<form action="">
    <input id="m" autocomplete="off" />
</form>
<div id="converted"></div>

<script src="http://192.168.0.107:4001/socket.io/socket.io.js"></script>
<script src="https://code.jquery.com/jquery-1.11.1.js"></script>
<script>
    $(function() {
        var socket = io('http://192.168.0.107:4001');
        $('#m').on('input', function() {
            socket.emit('broadcast', $('#m').val());
        });
        $('form').submit(function(e) {
            e.preventDefault();
            return false;
        });

        socket.on('converted', function(msg) {
            $('#converted').text(msg);
        });
    });
</script>
</body>
</html>
