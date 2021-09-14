const express = require('express')
const cors = require('cors')

const app = express()

const PORT=3001
const fs = require('fs')
const path = require('path')
const pathToFile = path.resolve('./data.json')

app.use(express.json())

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

app.post("/api/resources", (req, res) => {
    console.log('Inside the Home Post page')
    const resources = getResources()
    const resource = req.body
    resource.createdAt = new Date()
    resource.id = Date.now().toString()

    resources.unshift(resource)

    fs.writeFile(pathToFile, JSON.stringify(resources, null, 2), (error) => {
        if (error) {
            return res.status(422).send('Cannot write data to file')
        }
        return res.status(200).send("Data added")
    })



})


app.listen(PORT, () => {console.log(`Server is running at ${PORT}`)})