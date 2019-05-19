var socketIo = require('socket.io').listen(7001);

socketIo.sockets.on('connection', function ( socket ) {
    socket.emit('test', '연결 완료');
    socket.on('message', function ( data ) {
        console.log('Client로부터 받은 메세지 : %s', data.toString('utf8'));
        socket.emit('returnMsg', data);
    });

});



