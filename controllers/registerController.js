const usersDB = {
    users: require('../model/users.json'),
    setUsers: function (data) { this.users = data }
};
const fsPromises = require('fs').promises;
const path = require('path');
const bcrypt = require('bcrypt');

const handleNewUser = async (req, res) => {
    const { user, password } = req.body;
    if (!user || !password) return res.status(400).json({ "message": "user and password required."});
    //dupe username check
    const duplicate = usersDB.users.find(person => person.username === user);
    if (duplicate) return res.status(409);

    try {
        const hashed = await bcrypt.hash(password, 10);
        const newUser = { 'username': user, "password": hashed };

        usersDB.setUsers([...usersDB.users, newUser]);

        await fsPromises.writeFile(
            path.join(__dirname, "..", 'model', 'users.json'),
            JSON.stringify(usersDB.users)
        );
        console.log(usersDB.users);
        res.status(201).json({ 'success': `New user ${newUser.username} created.`})
    } catch (error) {
        res.status(500).json({ "message": error.message })
    } 
}

module.exports = { handleNewUser }