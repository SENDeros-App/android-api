var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const http = require('http');
const socketIO = require('socket.io');
const { connect } = require('./config/database');

var indexRouter = require('./routes/index');
const apiRouter = require('./routes/api');

connect();

var app = express();
var server = http.createServer(app);
var io = socketIO(server);

io.on('connection', (socket) => {
  console.log(socket)
  console.log('Cliente conectado:', socket.id);
  console.log(socket.on)

  socket.on('Marcadores', (data) => {
    console.log('recibido',data)
    // Realiza las operaciones necesarias con la base de datos
    // utilizando la referencia 'db' obtenida anteriormente

    // Emitir los marcadores actualizados a todos los clientes conectados
    io.emit('Marcadores', data);
    console.log('enviado', data)
  });

  socket.on('disconnect', () => {
    console.log('Cliente desconectado:', socket.id);
  });
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api', apiRouter);

app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

const socketPort = 3000;
server.listen(socketPort, () => {
  console.log('Servidor de sockets escuchando en el puerto', socketPort);
});

module.exports = app;
