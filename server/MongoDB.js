const { MongoClient } = require("mongodb");
const products = require("./sources/products.json");

async function Connection() {
  const MONGODB_URI =
    "mongodb+srv://user:clear-fashion@cluster0.2j3o0.mongodb.net/myFirstDatabase?retryWrites=true&writeConcern=majority";
  const MONGODB_DB_NAME = "Cluster0";

  try {
    const client = await MongoClient.connect(MONGODB_URI, {
      useNewUrlParser: true,
    });
    const db = client.db(MONGODB_DB_NAME);
    console.log("connected");
    return db;
  } catch (e) {
    console.error(e);
  }
}

async function InsertProducts() {
  const db = await Connection();
  const collection = db.collection("products");
  const result = collection.insertMany(products);
  console.log(result);
}

async function Prod_by_brand(brand) {
  const db = await Connection();
  const collection = db.collection("products");
  collection
    .find({
      brand: brand,
    })
    .toArray(function (err, result) {
      if (err) throw err;
      console.log(result);
    });
}

async function Prod_lt_price(price) {
  const db = await Connection();
  const collection = db.collection("products");
  collection.find({ price: { $lt: price } }).toArray(function (err, result) {
    if (err) throw err;
    console.log(result);
  });
}

async function Prod_by_price() {
  const db = await Connection();
  const collection = db.collection("products");
  collection
    .aggregate([{ $sort: { price: 1 } }])
    .toArray(function (err, result) {
      if (err) throw err;
      console.log(result);
    });
}

async function Prod_by_date() {
  const db = await Connection();
  const collection = db.collection("products");
  collection
    .aggregate([{ $sort: { date: -1 } }])
    .toArray(function (err, result) {
      if (err) throw err;
      console.log(result);
    });
}

async function Prod_lt_2w() {
  const db = await Connection();
  const collection = db.collection("products");
  collection
    .find({ date: { $gt: new Date(Date.now() - 12096e5).toISOString() } })
    .toArray(function (err, result) {
      if (err) throw err;
      console.log(result);
    });
}

module.exports.Prod_by_id = async (id) => {
  console.log(id);
  const db = await Connection();
  const collection = db.collection("products");
  const result = await collection.find({ _id: id }).toArray();
  console.log(result);
  return result;
};

module.exports.Search = async (params) => {
  var brand = ["loom", "montlimart", "adresseparis", "dedicatedbrand"];
  var price = 9999999999999;
  var limit = 12;
  if ("limit" in params) {
    var limit = parseInt(params.limit);
  }
  if ("brand" in params) {
    var brand = [params.brand];
  }
  if ("price" in params) {
    var price = parseInt(params.price);
  }
  const db = await Connection();
  const collection = db.collection("products");
  const result = await collection
    .find({ $and: [{ brand: { $in: brand } }, { price: { $lt: price } }] })
    .limit(limit)
    .toArray();
  console.log(result);
  return result;
};

// InsertProducts();
// Prod_by_brand("loom");
// Prod_lt_price(50);
// Prod_by_price();
// Prod_by_date();
// Prod_lt_2w();
// Prod_by_id("2f793a3f-833d-58d0-aa47-d739069f10e5")
