// import/require the express npm module
const express = require('express');

// create our server instance using express
const server = express()
//import data
const db = require("./database.js")

// Middleware - we'll learn about this later
// allows our api to parse request bodies that are json objects
server.use(express.json())

// POST /api/users
server.post("/api/users", (req, res) => {
    if ((!req.body.name) || (!req.body.bio)) {
        return res.status(400).json({
            errorMessage: "Please provide name and bio for the user."
        })
    }

    const newUser = db.createUser({
        name: req.body.name,
        bio: req.body.bio
    })

    res.status(201).json(newUser)
})

// GET /api/users
server.get("/api/users", (req, res) => {
    const users = db.getUsers()
    res.json(users)

     if (user) {
         res.json(user)
     } else {
         res.status(500).json({
             errorMessage: "The users information could be retrieved."
         })
     }
})

// GET /api/users/:id (returns the user object with specified id)
server.get("/api/users/:id", (req, res) => {
    const userId = req.params.id 
    const user = db.getUserById(userId)
    
    if (user) {
        res.json(user)
    } else {
        console.log(user)
        res.status(404).json({
            message: "The user with the specified ID does not exist.",
        })
    }
})

server.listen(3000, () => {
    console.log(`server started at port ${3000}`)
})