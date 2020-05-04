const mongoose = require('mongoose')

// mongoose.connect('mongodb://127.0.0.1:27017/db-server-api', {
mongoose.connect('mongodb+srv://laboratorio:laboratorio@cluster0-a9lu8.mongodb.net/test?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
})