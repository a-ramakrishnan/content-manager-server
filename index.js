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

app.get("/api/activeresource", (req, res) => {


    const resources = getResources()
    const activeResource = resources.find((item) => item.status === "active")

    console.log("Inside Active Resource Function")

    if (activeResource)
        res.status(200).send(activeResource)
    else
        res.status(200).send("No active Resource")
})

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
    resource.status = "inactive"

    resources.unshift(resource)

    fs.writeFile(pathToFile, JSON.stringify(resources, null, 2), (error) => {
        if (error) {
            return res.status(422).send('Cannot write data to file')
        }
        return res.status(200).send("Data added")
    })
})

app.get("/api/resources/:id", (req, res) => {
    const resources = getResources()
    const resourceId = req.params.id

    const resource = resources.find((item) => {
        return item.id === resourceId;
    })

    res.status(200).send(resource)
})



app.patch("/api/resources/:id", (req, res) => {
    const resources = getResources()
    const resourceId = req.params.id

    const index = resources.findIndex((item) => item.id === resourceId)
    const activeResource = resources.find((item) => item.status === "active")

    if (req.body.status === "active" && req.body.activate === true) {
        if (activeResource) {
            return res.status(422).send("You already have an active resource")
        }
        resources[index].status = "active"
        resources[index].lastActivationTime = new Date()
    } else if (req.body.status === "inactive" && req.body.deactivate === true) {
        resources[index].status = "inactive"
        resources[index].lastDeActivationTime = new Date()
    }else {
        resources[index] = req.body
    }

    fs.writeFile(pathToFile, JSON.stringify(resources, null, 2), (error) => {
        if (error) {
            return res.status(422).send('Cannot write data to file')
        }
        return res.status(200).send("Data added")
    })
})




app.listen(PORT, () => {console.log(`Server is running at ${PORT}`)})