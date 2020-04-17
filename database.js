let users = [
    {
        id: '1',
        name: "Hasan",
        bio: "Eldest"
    },
    {
        id: '2',
        name: "Amin",
        bio: "Middle"
    },
    {
        id: '3',
        name: "Maryam",
        bio: "Youngest"
    }
]

function getUsers() {
    return users
}

function getUserById(id) {
    return users.find(u => u.id === id)
}

function createUser(data) {
    const payload = {
        id: String(users.length + 1),
        ...data,
    }

    users.push(payload)
    return payload
}

module.exports = {
    getUsers,
    getUserById,
    createUser
}