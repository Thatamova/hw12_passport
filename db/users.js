const uidGenerator = require('node-unique-id-generator');

const users = [
  {
    id: '1',
    username: 'test',
    password: 'test',
    displayName: 'User'
  }
]

exports.findById = (id, cb) => {
  process.nextTick(() => {
    const user = users.find(user => user.id === id);
    if (user) {
      cb(null, user);
    } else {
      cb(new Error('User ' + id + ' does not exist'))
    }
  })
}

exports.findByUsername = (username, cb) => {
  process.nextTick(() => {
    const user = users.find(user => user.username === username);

    if (user) {
      return cb(null, user)
    } else {
      return cb(null, null)
    }
  })
}

exports.verifyPassword = (user, password) => {
  return user.password === password
}

// добавляем нового юзера
exports.addUser = (user, cb) => {
  process.nextTick(() => {
    const currentUser = users.find(current => current.username === user.username);

    if (!currentUser && user) {
      const newUser = {
        id: uidGenerator.generateUniqueId(),
        ...user
      }

      users.push(newUser);
      return cb(null, true);
    }

    return cb(null, null);
  })
}