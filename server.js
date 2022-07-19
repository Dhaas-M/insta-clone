const express = require('express')
const { default: mongoose, connect } = require('mongoose')
const cors = require('cors')
const app = express()
const PORT = process.env.PORT || 4000
const {MONGOURI} = require('./config/info')
//create project
//create cluster or build database
//choose ip
//create user
//connect with project

mongoose.connect(MONGOURI)
mongoose.connection.on('connected', () => {
    console.log('mongo connected...')
})
mongoose.connection.on('error', (err) => {
    console.log(err)
})
//registering
require('./models/user')
require('./models/post')
//cors
app.use(cors())
//json middleware
app.use(express.json())
//routers
app.use(require('./routes/auth'))
app.use(require('./routes/post'))
app.use(require('./routes/user'))

//FOR PRODUCTION
if(process.env.NODE_ENV === 'production'){
    app.use(express.static('client/build'))
    const path = require('path')
    app.get('*', (req,res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
    })
}

 
app.listen(PORT, () => {
    console.log(`server running on${PORT}`)
})