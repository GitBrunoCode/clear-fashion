const montlimart = require('montlimart');

const products = montlimart.scrape('https://www.montlimart.com/toute-la-collection.html?limit=all');

products.forEach(product => {
  console.log(products.name);
})

