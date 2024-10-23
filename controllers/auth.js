const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');

const usersFilePath = path.join(__dirname, '..', 'data', 'users.json');

// Helper function to read users from JSON file
const readUsers = () => {
  if (!fs.existsSync(usersFilePath)) {
    return [];
  }
  const data = fs.readFileSync(usersFilePath, 'utf8');
  return JSON.parse(data);
};

// Helper function to write users to JSON file
const writeUsers = (users) => {
  const data = JSON.stringify(users, null, 2);
  fs.writeFileSync(usersFilePath, data);
};

exports.signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const users = readUsers();

    // Check if user already exists
    if (users.some(user => user.email === email)) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = {
      id: users.length + 1,
      username,
      email,
      password: hashedPassword
    };

    // Add user to array and save to file
    users.push(newUser);
    writeUsers(users);

    res.status(201).json({ message: 'User created successfully', userId: newUser.id });
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const users = readUsers();

    // Find user
    const user = users.find(user => user.email === email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // TODO: Generate and send JWT token here

    res.status(200).json({ message: 'Login successful', userId: user.id });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
};
