const express = require('express')
const cors = require('cors')

const app = express()

const PORT=3001
const fs = require('fs')
const path = require('path')
const pathToFile = path.resolve('./data.json')

var corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200
}

app.use(cors(corsOptions))

const getResources = () => JSON.parse(fs.readFileSync(pathToFile))

app.get("/api/resources", (req, res) => {
    console.log('Inside the Home page')
    res.status(200).json(getResources())
})


app.listen(PORT, () => {console.log(`Server is running at ${PORT}`)})