var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const http = require('http');
const socketIO = require('socket.io');
const { connect } = require('./config/database');
const axios = require('axios');

var indexRouter = require('./routes/index');
const apiRouter = require('./routes/api');

connect();

var app = express();
var server = http.createServer(app);
var io = socketIO(server);

io.on('connection', (socket) => {
  //console.log(socket)
  console.log('Cliente conectado:', socket.id);


  //console.log(socket.on)
  const axios = require('axios');

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////

/*
  // Token de autenticación
    const token1 = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NDkzNzlkY2Q5NjdhMGQyOTIwNzEyMjIiLCJpYXQiOjE2ODkyMDgxMTcsImV4cCI6MTY4OTI5NDUxN30.ZHR8R6vGKf61AVMY-1j9hz-kqBY7epVY4bSWxDM4v8A';

  // Configurar los encabezados de la solicitud con el token de autenticación
  const headers = {
    'Authorization': `Bearer ${token1}`
  };

   // Realizar la solicitud GET para obtener todas las alertas
   axios.get('http://192.168.1.35:3000/api/alert', { headers })
   .then(response => {
     const alerts = response.data; // Obtener las alertas de la respuesta

     // Enviar las alertas al cliente a través del socket
     socket.emit('Alertas', alerts);
   })
   .catch(error => {
     console.error('Error al obtener las alertas:', error);
   });
*/
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////
  
  

  socket.on('Marcadores', (data) => {
    console.log('Recibido:', data);
  
    // Token de autenticación
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NDkzNzlkY2Q5NjdhMGQyOTIwNzEyMjIiLCJpYXQiOjE2ODkyMDgxMTcsImV4cCI6MTY4OTI5NDUxN30.ZHR8R6vGKf61AVMY-1j9hz-kqBY7epVY4bSWxDM4v8A';
  
    // Configurar los encabezados de la solicitud con el token de autenticación
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  
    // Realizar la solicitud POST a la dirección deseada
    axios.post('http://192.168.1.35:3000/api/alert', data, { headers })
      .then(response => {
        console.log('Respuesta recibida:', response.data);
        // Si deseas emitir la respuesta a través del socket
        socket.emit('RespuestaMarcadores', response.data);
      })
      .catch(error => {
        console.error('Error al hacer la solicitud POST:', error);
      });
  
    socket.emit('Marcadores', data);
    console.log('Enviado:', data);
  });
  
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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

const socketPort = 5000;
server.listen(socketPort, () => {
  console.log('Servidor de sockets escuchando en el puerto', socketPort);
});

module.exports = app;
