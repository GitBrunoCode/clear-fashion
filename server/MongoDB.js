const { MongoClient } = require("mongodb");
const products = require("./sources/products.json");
const { calculateLimitAndOffset, paginate } = require("paginate-info");

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
  const db = await Connection();
  const collection = db.collection("products");
  var brand = await collection.distinct("brand");
  var price = 9999999999999;
  var size = 12;
  var page = 1;
  var sort = "price_asc";
  var date = "2011-10-05T14:48:00.000Z";
  if ("size" in params) {
    var size = parseInt(params.size);
  }
  if ("brand" in params) {
    var brand = [params.brand];
  }
  if ("price" in params) {
    var price = parseInt(params.price);
  }
  if ("page" in params) {
    var page = parseInt(params.page);
  }
  if ("sort" in params) {
    var sort = [params.sort];
  }
  if ("otherfilter" in params) {
    if (params.otherfilter == "reas_price") {
      price = 50;
      console.log("dfjdsfjifd");
    }
    if (params.otherfilter == "rec_date") {
      date = new Date(Date.now() - 12096e5).toISOString();
    }
  }
  const { limit, offset } = calculateLimitAndOffset(page, size);
  var result = {};
  result["pagecount"] = await collection
    .find({
      $and: [
        { brand: { $in: brand } },
        { price: { $lt: price }, date: { $gt: date } },
      ],
    })
    .count();
  result["pagecount"] = Math.ceil(result["pagecount"] / size);
  result["currentPage"] = page;
  result["pageSize"] = size;

  if (sort == "price_asc") {
    result["products"] = await collection
      .find({
        $and: [
          { brand: { $in: brand } },
          { price: { $lt: price }, date: { $gt: date } },
        ],
      })
      .sort({ price: 1 })
      .limit(limit)
      .skip(offset)
      .toArray();
    // console.log(result);
    return result;
  } else if (sort == "price_desc") {
    result["products"] = await collection
      .find({
        $and: [
          { brand: { $in: brand } },
          { price: { $lt: price }, date: { $gt: date } },
        ],
      })
      .sort({ price: -1 })
      .limit(limit)
      .skip(offset)
      .toArray();
    // console.log(result);
    return result;
  } else if (sort == "date_asc") {
    result["products"] = await collection
      .find({
        $and: [
          { brand: { $in: brand } },
          { price: { $lt: price }, date: { $gt: date } },
        ],
      })
      .sort({ date: 1 })
      .limit(limit)
      .skip(offset)
      .toArray();
    //console.log(result);
    return result;
  } else sort == "date_desc";
  {
    result["products"] = await collection
      .find({
        $and: [
          { brand: { $in: brand } },
          { price: { $lt: price }, date: { $gt: date } },
        ],
      })
      .sort({ date: -1 })
      .limit(limit)
      .skip(offset)
      .toArray();
    //console.log(result);
    return result;
  }
};

module.exports.DB_info = async () => {
  let result = {};
  const db = await Connection();
  const collection = db.collection("products");
  result["nb_products"] = await collection.countDocuments();
  result["last released"] = await collection
    .find()
    .sort({ date: -1 })
    .limit(1)
    .toArray();
  result["last released"] = result["last released"][0]["date"];
  result["Q50"] = await collection
    .find()
    .sort({ price: 1 })
    .skip(Math.floor(result["nb_products"] / 2))
    .limit(1)
    .toArray();
  result["Q50"] = result["Q50"][0]["price"];
  result["Q90"] = await collection
    .find()
    .sort({ price: 1 })
    .skip(Math.floor(result["nb_products"] * 0.9))
    .limit(1)
    .toArray();
  result["Q90"] = result["Q90"][0]["price"];
  result["Q95"] = await collection
    .find()
    .sort({ price: 1 })
    .skip(Math.floor(result["nb_products"] * 0.95))
    .limit(1)
    .toArray();
  result["Q95"] = result["Q95"][0]["price"];
  result["brands"] = await collection.distinct("brand");
  result["nb_new_products"] = await collection
    .find({ date: { $gt: new Date(Date.now() - 12096e5).toISOString() } })
    .count();
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
