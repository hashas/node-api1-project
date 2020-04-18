// import/require the express npm module
const express = require('express');

// create our server instance using express
const server = express()
// import data
const db = require("./database.js")

// const users = db.getUsers()
// I tried declare the users variable here to keep code DRY
// however as this is assigned to a function which returns
// list of users, if I don't include this in each HTTP request
// then I don't get a refreshed/updated list of users within that
// request

// Middleware - we'll learn about this later
// allows our api to parse request bodies that are json objects
server.use(express.json())

// POST (/api/users) create user using info sent inside request body
server.post("/api/users", (req, res) => {
    // check if the request body is missing the 'name' or 'bio' property
    if ((!req.body.name) || (!req.body.bio)) {
        return res.status(400).json({
            errorMessage: "Please provide name and bio for the user."
        })
    }
    
    // create the user using db.createUser() function
    const newUser = db.createUser({
        name: req.body.name,
        bio: req.body.bio
    })

    // check if there was an error while saving the user
    const users = db.getUsers()
    if (!(users.find(u => u.id === newUser.id))) {
        res.status(500).json({
            errorMessage: "There was an error while saving the user to the database"
        })
    } else {
        // res.json() can only take one object, not multiple responses
        res.status(201).json({newUser, message: "success"})
    }
// BUG: if I create user after deleting one of initial users, its going to assign
// created user with an existing ID because ID is assigned in db.createUser() using
// users.length + 1. One way to fix this would be dynamically reassigning the IDs of 
// remaining users starting from 0 or 1 after a user is deleted
})

// GET (/api/users) return array of users
server.get("/api/users", (req, res) => {
    
    // check if there's an error retrieving the users from the database
    // res.json(users)
    const users = db.getUsers()
    if (users) {
         res.json(users)
    } else {
         res.status(500).json({
             errorMessage: "The users information could be retrieved."
        })
    }
})

// GET (/api/users/:id) return the user object with specified id
server.get("/api/users/:id", (req, res) => {
    // if the user with specific ID is not found
    const userId = req.params.id 
    const user = db.getUserById(userId)
    if (user) {
        res.json(user)
    } else {
        res.status(404).json({
            message: "The user with the specified ID does not exist.",
        })
    }
})

// DELETE (api/users/:id) Removes the user with the specified id and returs
// deleted user

server.delete("/api/users/:id", (req, res) => {
    // if the user with with specified ID is not found
    const userId = req.params.id 
    const user = db.getUserById(userId)

    if (!user) {
            res.status(404).json({
            message: "The user with the specified ID does not exist."
        })
    }

    db.deleteUser(user.id)
    res.status(200).json(`The user with the id:${userId} has been removed`)

    if (user) {
        res.status(500).json({
            errorMessage: "The user could not be removed"
        })
    }
})

// PUT (api/users/:id) Updates the user with the specified ID
// using data from the request body, and returns the modified user
server.put("/api/users/:id", (req, res) => {
    // if the user with specific ID is not found, respond with 404
    const userId = req.params.id 
    const user = db.getUserById(userId)

    if (!user) {
        res.status(404).json({
            message: "The user with the specified ID does not exist."
        })
    // if the request is missing the name AND bio, ask for either/or
    } else if (!req.body.name && !req.body.bio) {
        res.status(400).json({
            errorMessage: "Please provide name or bio for the user"
        })
    // if the user is found and new info is valid, return updated user
    } else {
        const updatedUser = db.updateUser(user.id, {
            name: req.body.name || user.name,
            bio: req.body.bio || user.bio
        })
        res.status(200).json(updatedUser)
    }

    // check if there's an error updating the user, return 500
    const users = db.getUsers()
    if (!(users.find(u => {
        (u.name === updatedUser.name) && (u.bio === updatedUser.bio) 
    }))) {
        res.status(500).json({
            errorMessage: "The user information could not be modified"
        })
    }
})

server.listen(3000, () => {
    console.log(`server started at port ${3000}`)
})