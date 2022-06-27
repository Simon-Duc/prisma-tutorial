require("dotenv").config();
const express = require("express");
const router = express.Router();
const app = express();
const mysql = require("mysql2");
const port = parseInt(process.env.APP_PORT ?? "5000", 10);
const {PrismaClient} = require("@prisma/client");
const prisma = new PrismaClient();

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

connection.connect((err) => {
  if (err) {
    console.error("error connecting: " + err.stack);
  } else {
    console.log("connected as id " + connection.threadId);
  }
});

app.use(router);

app.get("/", (req, res) => {
  res.send(`Hello World! I'm running on port ${port}`);
});

app.use(express.json());

app.get("/users", (req, res) => {
  connection.query("SELECT * FROM user", (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error retrieving users from database");
    } else {
      res.json(result);
    }
  });
});

app.post("/users", (req, res) => {
  const { id, firstname, lastname } = req.body;
  connection.query(
    "INSERT INTO user (id, firstname, lastname) VALUES (?, ?, ?)",
    [id, firstname, lastname],
    (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error saving the user");
      } else {
        res.status(200).send("User successfully saved");
      }
    }
  );
});

app.listen(port, (err) => {
  if (err) {
    console.error("Something bad happened");
  } else {
    // eslint-disable-next-line no-restricted-syntax
    console.log(`Server is listening on ${port}`);
  }
});

async function main() {
  const allUsers = await prisma.user.findMany()
  console.log(allUsers)

  const result = await prisma.user.findUnique({
    where: {
      id: 2,
    }})
  console.log(result)
}

main()
  .catch((e) => {
    throw e
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

module.exports = app;

//Prisma permet de remplacer le modèle du MVC => model.user devient prisma.user findOne devient findUnique, à voir sur les MVC des projets