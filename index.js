const express = require("express");
const cors = require("cors");
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

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
    const bookedCarsCollection = client.db("buySell").collection("bookedCar");

    app.post("/sellarAddCar", async (req, res) => {
      const addCar = req.body;
      const result = await categoriesCollection.insertOne(addCar);
      res.send(result);
    });

    app.put("/verify/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = { _id: ObjectId(id) };
      const loginSellers = await categoriesCollection.find(query).toArray();
      const upsert = true;
      const updateDoc = {
        $set: {
          sellarVerified: true,
        },
      };
      const result = await categoriesCollection.updateOne(query, updateDoc);
      res.send(result);
    });

    app.get("/getallthesellars", async (req, res) => {
      const query = { role: "seller" };
      const result = await usersCollection.find(query).toArray();
      const filter = {};
      const allUsers = await categoriesCollection.find(filter).toArray();
      const allSellars = result.map((allSellar) => {
        const Sellars = allUsers.filter(
          (allUser) => allUser.email === allSellar.email
        );
      });

      res.send(allUsers);
    });

    app.delete("/mydeleteproduct/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const result = await categoriesCollection.deleteOne(filter);
      res.send(result);
    });

    app.delete("/userdelete/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const result = await bookedCarsCollection.deleteOne(filter);
      res.send(result);
    });

    app.get("/getalltheusers", async (req, res) => {
      const query = {};
      const result = await bookedCarsCollection.find(query).toArray();
      res.send(result);
    });

    app.get("/getpayment/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const result = await bookedCarsCollection.findOne(filter);
      res.send(result);
    });

    app.get("/getBookedCar", async (req, res) => {
      const email = req.query.email;
      console.log(email);
      const filter = { email: email };
      const result = await bookedCarsCollection.find(filter).toArray();
      res.send(result);
    });
    app.get("/myproduct", async (req, res) => {
      const email = req.query.email;

      console.log(email);
      const filter = { email: email };
      const result = await categoriesCollection.find(filter).toArray();
      res.send(result);
    });

    app.post("/bookedCar", async (req, res) => {
      const car = req.body;
      const result = await bookedCarsCollection.insertOne(car);
      res.send(result);
    });

    app.get("/user/wanted", async (req, res) => {
      const email = req.query.email;
      const filter = { email: email };
      const result = await usersCollection.findOne(filter);

      if (result.role === "seller") {
        return res.send({ message: "sellar" });
      }
      if (result.role === "user") {
        return res.send({ message: "user" });
      }
      if (result.role === "admin") {
        return res.send({ message: "admin" });
      }
      res.send({ message: "" });
    });

    app.get("/category/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { product_id: id };
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
        // console.log(token);
        return res.send({ accessToken: token });
      }
      res.status(403).send({ accessToken: "Error accured" });
    });

    app.post("/users", async (req, res) => {
      const user = req.body;
      // console.log(user);
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
