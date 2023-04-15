// const sqlite3 = require('sqlite3').verbose();
//
// let db = new sqlite3.Database('./db.sqlite', (err) => {
//         if (err) {
//             return console.error(err.message);
//         }
//         console.log('Connected to the SQlite database.');
//     }
// );
// function createUserTable() {
//     db.run(`CREATE TABLE IF NOT EXISTS users (
//         id TEXT PRIMARY KEY,
//         passwordHash TEXT NOT NULL,
//         isAdmin BOOLEAN NOT NULL
//     )`);
// }
// function insertUser(id, passwordHash, isAdmin) {
//     db.run(`INSERT INTO users (id, passwordHash, isAdmin) VALUES (?, ?, ?)`, [id, passwordHash, isAdmin], function(err) {
//         if (err) {
//             console.error(err.message);
//         }
//     });
// }
//
// function getUserById(id) {
//     return new Promise((resolve, reject) => {
//         db.get(`SELECT * FROM users WHERE id = ?`, [id], function(err, row) {
//             if (err) {
//                 reject(err);
//             } else if (!row) {
//                 resolve(null);
//             } else {
//                 resolve({
//                     id: row.id,
//                     passwordHash: row.passwordHash,
//                     isAdmin: row.isAdmin
//                 });
//             }
//         });
//     });
// }
// // Create the user table if it doesn't exist
// createUserTable();
//
// module.exports = {
//     insertUser,
//     getUserById
// };

//
//
const Users = [
    {id: "admin", password: "admin", isAdmin: true},
    {id: "noob", password: "noob", isAdmin: false}
];
module.exports = Users;