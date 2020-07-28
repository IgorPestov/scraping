const express = require("express");
const app = express();
const PORT = 3000;
const routes = require('./components/routes/routes')
const cors = require('cors')
const bodyParser = require('body-parser')
app.use(cors())
app.use(bodyParser.json())

app.use('/', routes)

app.listen(PORT, ()=> {
    console.log(`Listening on port ${PORT}`)
})