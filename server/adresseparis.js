const adresseparis = require('adresseparis');
const products = adresseparis.scrape('https://adresse.paris/630-toute-la-collection');

products.forEach(product => {
    console.log("a")
  console.log(products.name);
})