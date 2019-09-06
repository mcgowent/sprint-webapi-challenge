// // code away!
require('dotenv').config() // Allows use of a .env file to save the port

const express = require('express') //importing express
const actionsRouter = require('./_actions_/actionsRoute')  // Connecting the routes for actions
const projectsRouter = require('./_projects_/projectsRoute')  // Connecting the routes for projects

const port = process.env.PORT  // Use a project white variable to set the port


const server = express() //setting up express
// server.use(express.json()) // Makes all data to be read as json

server.use(express.json())


server.use('/api/actions', actionsRouter)  // Setting up initial endpoints
server.use('/api/projects', projectsRouter)

server.listen(port, () => {
    console.log(`Server running on port ${port}`)
})