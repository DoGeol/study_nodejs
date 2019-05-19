var socketIo = require('socket.io-client');

var client = socketIo.connect('http://localhost:7001', {reconnect : true});

client.on('test', function ( data ) {
    console.log('Server로 부터 받은 메세지 : %s', data.toString('utf8'));
});

client.emit('message', '안녕!');
client.on('returnMsg', function ( data ) {
    console.log('Server로 부터 받은 다시 받은 메세지 : %s', data.toString('utf8'));
});