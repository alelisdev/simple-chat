var express = require('express');
var app     = express();
var server  = require('http').createServer(app);

var session = require('express-session');
var io      = require('socket.io')(server);
const rateLimiter = require('./rateLimits.js');

//Add recent chats to messages array
var messages  = [];
var prevChats = 10;
var storeMessage = function(name, data){
  messages.push({name: name, data: data});
  if (messages.length > prevChats) {
    messages.shift();
  }
};

app.use(session({
  secret: 'index route secret',
  resave: false,
  saveUninitialized: true
}));


// apply rate limiter all request
rateLimiter(app);

// Setup the app with Express
app.use(express.static(__dirname + '/public'));

io.on('connection', function(socket){
  socket.use((packet, next) => {
    // Handler
    next();
  });
  socket.on('room', function(room){
    console.log(socket);
  });
  
  //Log activity
  socket.on('join', function(name){
    socket.userName = name;
    socket.broadcast.emit('chat', name + ' has joined the chat');
    console.log(name + ' has joined the chat');

    //Log who has left
    socket.on('disconnect', function(){
      socket.broadcast.emit('chat', name + ' has left the chat');
      console.log(name + ' has left the chat');
    });
  });

  //Log chats
  socket.on('chat', function(message){
    io.emit('chat', socket.userName + ': ' + message);
    storeMessage(socket.userName, message);
    console.log(socket.userName + ': ' + message);
  });

  //Log previous chats for new users
  messages.forEach(function(message){
    socket.emit('chat', message.name + ': ' + message.data);
  });
});

var evs = server.listeners('request').slice(0);
var qs = require('querystring');
var parse = require('url').parse;

server.on('request', function(req, res, next) {
  // if (!req._query) {
  //   req._query = ~req.url.indexOf('?') ? qs.parse(parse(req.url).query) : {};
  // }
  // if(!req._query.sid) {
  //   req.session.socket = 'connencted';
  // } else {
  //   if(req.session.socket == 'connected') {
  //     console.log('success');
  //   }
  // }
});

server.on('GET', function(req, res, next) {
  // if (!req._query) {
  //   req._query = ~req.url.indexOf('?') ? qs.parse(parse(req.url).query) : {};
  // }
  // if(!req._query.sid) {
  //   req.session.socket = 'connencted';
  // } else {
  //   if(req.session.socket == 'connected') {
  //     console.log('success');
  //   }
  // }
});

app.use('/', function(req, res) {
  console.log(req.session);
  req.session.socket = 'connected';
})

app.get('/', function(req, res){
  res.sendFile(path.join(__dirname, 'index.html'));
});


server.addListener('request', evs[0]);
//Listen at localhost:3000
server.listen(3000, function(){
  console.log('listening on *:3000');
});
