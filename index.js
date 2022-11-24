const express = require("express");
const cors = require("cors");
const app = express();
const { MongoClient, ServerApiVersion } = require("mongodb");

require("dotenv").config();
app.use(cors());
const jwt = require("jsonwebtoken");
app.use(express.json());

const port = process.env.PORT || 5000;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.qzdbt4w.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
async function run() {
  try {
    const categoriesCollection = client.db("buySell").collection("categories");
    const usersCollection = client.db("buySell").collection("users");

    app.get("/category/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { ctg_id: id };
      const result = await categoriesCollection.find(filter).toArray();
      res.send(result);
    });

    app.get("/jwt", async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const user = await usersCollection.findOne(query);
      if (user) {
        const token = jwt.sign({ email }, process.env.ACCESS_TOKEN, {
          expiresIn: "10h",
        });
        console.log(token);
        return res.send({ accessToken: token });
      }
      res.status(403).send({accessToken:"Error accured"});
    });

    app.post("/users", async (req, res) => {
      const user = req.body;
      console.log(user);
      const result = await usersCollection.insertOne(user);
      res.send(result);
    });
  } finally {
  }
}

run().catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send(`assignment-12 running on port ${port}`);
});

app.listen(port, (req, res) => {
  console.log(`assignment-12 running on port ${port}`);
});
