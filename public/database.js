const sqlite3 = require("sqlite3");
const path = require("path");

const database = new sqlite3.Database(
  path.join(__dirname, "./app.sqlite3"),
  sqlite3.OPEN_READWRITE,
  (err) => {
    if (err) return console.error(err.message);
  }
);

const login = async (username, password) => {
  const prom = new Promise(
    (resolve) => {
      database.all(
        "SELECT * FROM users WHERE user_name=? AND password=?",
        [username, password],
        (err, rows) => {
          if (err) console.error(err.message);
          console.log(rows);
          resolve(rows);
        }
      );
    },
    (reject) => reject()
  );
  let result = await prom;
  return result;
};


module.exports= {login}