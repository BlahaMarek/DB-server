const express = require('express')
const userRouter = require('./routers/user')
const projectRouter = require('./routers/project')
const taskRouter = require('./routers/task')
const calendarRouter = require('./routers/calendar')
const messageRouter = require('./routers/message')
var bodyParser = require('body-parser');
require('./db/mongoose')

const app = express()
const port = process.env.PORT || 3000

app.use(express.json({limit: '50mb'}))
app.use(express.urlencoded({limit: '50mb'}));

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,PATCH,DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
  });

app.use(userRouter)
app.use(projectRouter)
app.use(taskRouter)
app.use(calendarRouter)
app.use(messageRouter)

app.listen(port, () => {
    console.log(`Server is up on port: ${port}`)
})