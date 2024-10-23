const fs = require('fs');
const path = require('path');

// Read users data from JSON file
const getUsersData = () => {
    const usersFilePath = path.join(__dirname, '..', 'data', 'users.json');
    const usersData = fs.readFileSync(usersFilePath, 'utf8');
    return JSON.parse(usersData);
};

// Get all users
exports.getAllUsers = (req, res) => {
    const users = getUsersData();
    res.json(users);
};

// Get a single user by ID
exports.getUserById = (req, res) => {
    const users = getUsersData();
    const user = users.find(u => u.id === parseInt(req.params.id));
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
};

// Create a new user
exports.createUser = (req, res) => {
    const users = getUsersData();
    const newUser = {
        id: users.length + 1,
        ...req.body
    };
    users.push(newUser);
    fs.writeFileSync(path.join(__dirname, '..', 'data', 'users.json'), JSON.stringify(users, null, 4));
    res.status(201).json(newUser);
};

// Update a user
exports.updateUser = (req, res) => {
    const users = getUsersData();
    const index = users.findIndex(u => u.id === parseInt(req.params.id));
    if (index === -1) {
        return res.status(404).json({ message: 'User not found' });
    }
    users[index] = { ...users[index], ...req.body };
    fs.writeFileSync(path.join(__dirname, '..', 'data', 'users.json'), JSON.stringify(users, null, 4));
    res.json(users[index]);
};

// Delete a user
exports.deleteUser = (req, res) => {
    const users = getUsersData();
    const index = users.findIndex(u => u.id === parseInt(req.params.id));
    if (index === -1) {
        return res.status(404).json({ message: 'User not found' });
    }
    const deletedUser = users.splice(index, 1)[0];
    fs.writeFileSync(path.join(__dirname, '..', 'data', 'users.json'), JSON.stringify(users, null, 4));
    res.json(deletedUser);
};
