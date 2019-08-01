var express = require('express')
var app = express()

var path = require('path')
var bodyParser = require('body-parser')
var server = require('http').createServer(app);
var io = require('socket.io')(server)

var index = require('./routes/index')
var data = require('./routes/data')
var spot = require('./routes/spot')
var cors = require('cors')

var port = 3000
app.io = io;
app.use(cors())

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: false
}))

app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);
app.use("/assets", express.static(__dirname + '/assets'));
app.use("/views", express.static(__dirname + '/views'));

app.use('/', index)
app.use('/api', [data, spot])

// io.on('connection', function (socket) {
//     console.log('a user connected');
//     socket.on('disconnect', function () {
//         console.log('user disconnected');
//     });
// });
// io.on('connection', function (socket) {
//     socket.emit('data', data);
// });

io.on('connection', function (socket) {
    console.log('client connect')
    socket.on('data', function (data) {
        console.log(data)
        io.sockets.emit('data', data)
    });
});

server.listen(port, function () {
    console.log('✈ Server berjalan di port ' + port + ' ✈')
})