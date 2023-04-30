const connectToMongo = require('./db')
const express = require('express')
var cors = require('cors')
const app = express()
var xmlparser = require('express-xml-bodyparser');
app.use(xmlparser());
connectToMongo()
const port = 5000
app.use(cors())
app.use(express.json())


app.use('/api/auth', require('./Routes/auth')) 
app.use('/api/communicate', require('./Routes/communicate')) 

app.get('/', (req, res) => {
    res.send('hi')
})

app.listen(port, () => {
    console.log(`backend listening at http://localhost:${port}`)
})