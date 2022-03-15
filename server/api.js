const cors = require("cors");
const express = require("express");
const helmet = require("helmet");
const mongo_request = require("./MongoDB");

const PORT = 8092;

const app = express();

module.exports = app;

app.use(require("body-parser").json());
app.use(cors());
app.use(helmet());

app.options("*", cors());

app.get("/", (request, response) => {
  response.send({ ack: true });
});

app.get("/products/search", async (request, response) => {
  const result = await mongo_request.Search(request.query);
  response.send(result);
});

app.get("/products/info", async (request, response) => {
  console.log("a")
  const result = await mongo_request.DB_info(request.params._id);
  response.send(result);
});

app.get("/products/:_id", async (request, response) => {
  const result = await mongo_request.Prod_by_id(request.params._id);
  response.send(result);
});

app.listen(PORT);

console.log(`📡 Running on port ${PORT}`);
