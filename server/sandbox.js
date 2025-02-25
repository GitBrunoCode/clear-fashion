/* eslint-disable no-console, no-process-exit */
const dedicatedbrand = require('./sources/dedicatedbrand');
const adresseparis = require('./sources/adresseparis');
const montlimart = require('./sources/montlimart');
const loom = require('./sources/loom');

const fs = require('fs');
const products_list = require('./sources/products.json');

let = brand_dico={ "dedicatedbrand":"https://www.dedicatedbrand.com/en/men/news",
"adresseparis":"https://adresse.paris/630-toute-la-collection",
"montlimart":"https://www.montlimart.com/toute-la-collection.html?limit=all",
"loom":"https://www.loom.fr/collections/tous-les-vetements"}


async function sandbox (eshop) {
  try {
    console.log(`🕵️‍♀️  browsing all sources`);
    let products = await dedicatedbrand.scrape(brand_dico["dedicatedbrand"]);
    products = products.concat(await adresseparis.scrape(brand_dico["adresseparis"]));
    products = products.concat(await montlimart.scrape(brand_dico["montlimart"]));
    products = products.concat(await loom.scrape(brand_dico["loom"]));

    console.log(products);
    console.log("all brands have been scraped")
    for(let j=0;j<products.length;j++)
    {
      if(contains(products_list,"_id",products[j]["_id"])==false)
      {
        products_list.push(products[j]);
      }
    }
    fs.writeFileSync("./sources/products.json", JSON.stringify(products_list));
    
    process.exit(0);

  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}




const [,, eshop] = process.argv;

sandbox(eshop);



function contains(arr, key, val) {
  for (var i = 0; i < arr.length; i++) {
    if (arr[i][key] === val) return true;
  }
  return false;
}