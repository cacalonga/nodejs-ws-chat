var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
//var WebSocket = require('../..');
var wss = require('ws');
//const WebSocket = require('ws');


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var denemeRouter = require('./routes/deneme');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/deneme', denemeRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});
//---------------------www--------------

console.log(process.cwd());

/**
 * Module dependencies.
 */

var debug = require('debug')('websocket-server:server');
var http = require('http');

/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || '5001');
app.set('port', port);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);

//----ws----

var s = new wss.Server({
    server
});
var lst = [];

s.on("connection", function (ws) {

    ws.on("message", function (message) {

        message = JSON.parse(message);

        if (message.type === "name") {
            ws.personName = message.data;
            var ld = message.data + " - "
            lst.push(ld);
            s.clients.forEach(function e(client) {
                if (client != ws) {
                    client.send(JSON.stringify({
                        name: "user joined ----> ",
                        data: message.data,
                    }));
                }
            })
            console.log(lst);
            return;
        }

        console.log("alınan mesaj : " + message.data);

        s.clients.forEach(function e(client) {
            if (client != ws) {
                client.send(JSON.stringify({
                    name: ws.personName,
                    data: message.data
                }));
            }
        })

    })
    ws.on("close", function () {
        console.log("client onclose");
    })

})
/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind = typeof port === 'string' ?
        'Pipe ' + port :
        'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string' ?
        'pipe ' + addr :
        'port ' + addr.port;
    debug('Listening on ' + bind);
}

//module.exports = app;