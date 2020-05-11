const http = require('http')
const express = require('express')
const socketio = require('socket.io')
require('./db/mongoose')
const app = express()
const server = http.createServer(app)
const io = socketio(server)
const port = process.env.PORT || 3000

const userRouter = require('./routers/user')
const projectRouter = require('./routers/project')
const taskRouter = require('./routers/task')
const calendarRouter = require('./routers/calendar')
const messageRouter = require('./routers/message')

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,PATCH,DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
  });
app.use(express.json({limit: '50mb'}))
app.use(express.urlencoded({limit: '50mb'}));
app.use(userRouter)
app.use(projectRouter)
app.use(taskRouter)
app.use(calendarRouter)
app.use(messageRouter)

server.listen(port, () => {
  console.log(`Server is up on port: ${port}`)
})

// SOCKET

var connectedUsers = {};

io.on('connection', (socket) => {

  socket.on('login', (userName) => {
    console.log(userName)
    socket.username = userName;
    connectedUsers[userName] = socket;

  });

  socket.on('private_chat',function(data){
    const to = data.to,
          message = data.message;

    if(connectedUsers.hasOwnProperty(to)){
        connectedUsers[to].emit('private_chat',{
            //The sender's username
            username : socket.username,

            //Message sent to receiver
            message : message
        });
    }

}); 

  socket.on('group', (msg) => {
    socket.broadcast.emit('group', msg);
  });

})

