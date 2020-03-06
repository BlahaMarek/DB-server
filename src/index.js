const express = require('express')
const userRouter = require('./routers/user')
const projectRouter = require('./routers/project')
const taskRouter = require('./routers/task')
require('./db/mongoose')

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,PATCH");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
  });
app.use(userRouter)
app.use(projectRouter)
app.use(taskRouter)

app.listen(port, () => {
    console.log(`Server is up on port: ${port}`)
})