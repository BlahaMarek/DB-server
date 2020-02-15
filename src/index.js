const express = require('express')
const userRouter = require('./routers/user')
const projectRouter = require('./routers/project')
require('./db/mongoose')

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())
app.use(userRouter)
app.use(projectRouter)

app.listen(port, () => {
    console.log(`Server is up on port: sss + ${port}`)
})