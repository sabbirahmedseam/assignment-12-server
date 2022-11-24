const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
app.use(express.json());
app.use(cors());
const { MongoClient, ServerApiVersion } = require("mongodb");

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

    app.get("/category/:id", async (req, res) => {
      const id = req.params.id;
      const filter={ctg_id:id}
      const result=await categoriesCollection.find(filter).toArray();
      res.send(result)
      
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
