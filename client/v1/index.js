// Invoking strict mode https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode#invoking_strict_mode
'use strict';

console.log('🚀 This is it.');

const MY_FAVORITE_BRANDS = [{
  'name': 'Hopaal',
  'url': 'https://hopaal.com/'
}, {
  'name': 'Loom',
  'url': 'https://www.loom.fr'
}, {
  'name': 'ADRESSE',
  'url': 'https://adresse.paris/'
}];

console.table(MY_FAVORITE_BRANDS);
console.log(MY_FAVORITE_BRANDS[0]);



/**
 * 🌱
 * Let's go with a very very simple first todo
 * Keep pushing
 * 🌱
 */

// 🎯 TODO: The cheapest t-shirt
// 0. I have 3 favorite brands stored in MY_FAVORITE_BRANDS variable
// 1. Create a new variable and assign it the link of the cheapest t-shirt
// I can find on these e-shops
// 2. Log the variable

const cheapest="https://www.loom.fr"
console.log("the cheapest",cheapest)


/**
 * 👕
 * Easy 😁?
 * Now we manipulate the variable `marketplace`
 * `marketplace` is a list of products from several brands e-shops
 * The variable is loaded by the file data.js
 * 👕
 */




// name is a member of myModule due to the export above



// 🎯 TODO: Number of products
// 1. Create a variable and assign it the number of products
// 2. Log the variable

const number_products=marketplace.length;
console.log("Number of product: ",number_products);


// 🎯 TODO: Brands name
// 1. Create a variable and assign it the list of brands name only
// 2. Log the variable
// 3. Log how many brands we have

let brand_name=[];

for (let i=0; i<marketplace.length;i++)
{
  if (!brand_name.includes(marketplace[i].brand))
  {
    brand_name.push(marketplace[i].brand);
  }
}
console.log(brand_name, "number of brand:",brand_name.length);

// 🎯 TODO: Sort by price
// 1. Create a function to sort the marketplace products by price
// 2. Create a variable and assign it the list of products by price from lowest to highest
// 3. Log the variable


function price_sort(a,b) {
  return a.price - b.price;
}

let marketplace_sort_price=Object.assign({},marketplace.sort(price_sort))
console.log("sort price",marketplace_sort_price);

// 🎯 TODO: Sort by date
// 1. Create a function to sort the marketplace objects by products date
// 2. Create a variable and assign it the list of products by date from recent to old
// 3. Log the variable

function date_sort(a, b) {
  return new Date(a.date).getTime() - new Date(b.date).getTime();
}

let marketplace_sort_date=Object.assign({},marketplace.sort(date_sort))
console.log("sort date:",marketplace_sort_date)

// 🎯 TODO: Filter a specific price range
// 1. Filter the list of products between 50€ and 100€
// 2. Log the list

let marketplace_price_50_100=marketplace.filter(x=>x.price<100 && x.price>50)
console.log("filter 50-100:",marketplace_price_50_100)

// 🎯 TODO: Average price
// 1. Determine the average price of the marketplace
// 2. Log the average

let price_list=[];
for (let i=0;i<marketplace.length;i++)
{
  price_list.push(marketplace[i].price)
}
console.log("average:",price_list.reduce((a, b) => a + b, 0)/marketplace.length)
/**
 * 🏎
 * We are almost done with the `marketplace` variable
 * Keep pushing
 * 🏎
 */

// 🎯 TODO: Products by brands
// 1. Create an object called `brands` to manipulate products by brand name
// The key is the brand name
// The value is the array of products
//
// Example:
// const brands = {
//   'brand-name-1': [{...}, {...}, ..., {...}],
//   'brand-name-2': [{...}, {...}, ..., {...}],
//   ....
//   'brand-name-n': [{...}, {...}, ..., {...}],
// };
//
// 2. Log the variable
// 3. Log the number of products by brands

function Brand_Products(market)
{
  let brand_dict={};
  for (let i=0;i<market.length;i++)
  {
    var clone = Object.assign({}, market[i]);
    delete clone.brand;

    if (market[i].brand in brand_dict)
    {
      brand_dict[market[i].brand].push(clone);
    }
    else
    {
      brand_dict[market[i].brand]=[clone];
    }
    
  }
  return brand_dict
}

const bybrand=Brand_Products(marketplace)
console.log("Product by brand: ",bybrand);

for (const key of Object.keys(bybrand)) {
  console.log(key," product number : ",bybrand[key].length);
}


// 🎯 TODO: Sort by price for each brand
// 1. For each brand, sort the products by price, from highest to lowest
// 2. Log the sort

const brand_prod_by_price=Object.assign({},bybrand)
for (const key of Object.keys(brand_prod_by_price))
{
  brand_prod_by_price[key]=Object.assign({},brand_prod_by_price[key].sort(price_sort))
}
console.log("Sort by brand and by price :",brand_prod_by_price)


// 🎯 TODO: Sort by date for each brand
// 1. For each brand, sort the products by date, from old to recent
// 2. Log the sort

const brand_prod_by_date=Object.assign({},bybrand)
for (const key of Object.keys(brand_prod_by_date))
{
  brand_prod_by_date[key]=Object.assign({},brand_prod_by_date[key].sort(date_sort))
}
console.log("Sort by brand and by date :",brand_prod_by_date)

/**
 * 💶
 * Let's talk about money now
 * Do some Maths
 * 💶
 */

// 🎯 TODO: Compute the p90 price value
// 1. Compute the p90 price value of each brand
// The p90 value (90th percentile) is the lower value expected to be exceeded in 90% of the products

const p90_bybrand={}

for (const [key,value] of Object.entries(brand_prod_by_price))
{
  const index=Math.floor(Object.keys(value).length*0.9);
  p90_bybrand[key]=brand_prod_by_price[key][index].price;
}

console.log("P90 by brand:",p90_bybrand)


/**
 * 🧥
 * Cool for your effort.
 * It's almost done
 * Now we manipulate the variable `COTELE_PARIS`
 * `COTELE_PARIS` is a list of products from https://coteleparis.com/collections/tous-les-produits-cotele
 * 🧥
 */

const COTELE_PARIS = [
  {
    link: 'https://coteleparis.com//collections/tous-les-produits-cotele/products/la-baseball-cap-gris',
    price: 45,
    name: 'BASEBALL CAP - TAUPE',
    uuid: 'af07d5a4-778d-56ad-b3f5-7001bf7f2b7d',
    released: '2021-01-11'
  },
  {
    link: 'https://coteleparis.com//collections/tous-les-produits-cotele/products/la-chemise-milleraie-navy',
    price: 85,
    name: 'CHEMISE MILLERAIE MIXTE - NAVY',
    uuid: 'd62e3055-1eb2-5c09-b865-9d0438bcf075',
    released: '2020-12-21'
  },
  {
    link: 'https://coteleparis.com//collections/tous-les-produits-cotele/products/la-veste-fuchsia',
    price: 110,
    name: 'VESTE - FUCHSIA',
    uuid: 'da3858a2-95e3-53da-b92c-7f3d535a753d',
    released: '2020-11-17'
  },
  {
    link: 'https://coteleparis.com//collections/tous-les-produits-cotele/products/la-baseball-cap-camel',
    price: 45,
    name: 'BASEBALL CAP - CAMEL',
    uuid: 'b56c6d88-749a-5b4c-b571-e5b5c6483131',
    released: '2020-10-19'
  },
  {
    link: 'https://coteleparis.com//collections/tous-les-produits-cotele/products/la-chemise-milleraie-beige',
    price: 85,
    name: 'CHEMISE MILLERAIE MIXTE - BEIGE',
    uuid: 'f64727eb-215e-5229-b3f9-063b5354700d',
    released: '2021-01-11'
  },
  {
    link: 'https://coteleparis.com//collections/tous-les-produits-cotele/products/la-veste-rouge-vermeil',
    price: 110,
    name: 'VESTE - ROUGE VERMEIL',
    uuid: '4370637a-9e34-5d0f-9631-04d54a838a6e',
    released: '2020-12-21'
  },
  {
    link: 'https://coteleparis.com//collections/tous-les-produits-cotele/products/la-chemise-milleraie-bordeaux',
    price: 85,
    name: 'CHEMISE MILLERAIE MIXTE - BORDEAUX',
    uuid: '93d80d82-3fc3-55dd-a7ef-09a32053e36c',
    released: '2020-12-21'
  },
  {
    link: 'https://coteleparis.com//collections/tous-les-produits-cotele/products/le-bob-dylan-gris',
    price: 45,
    name: 'BOB DYLAN - TAUPE',
    uuid: 'f48810f1-a822-5ee3-b41a-be15e9a97e3f',
    released: '2020-12-21'
  }
]

// 🎯 TODO: New released products
// // 1. Log if we have new products only (true or false)
// // A new product is a product `released` less than 2 weeks.

function IsNewProduct(released_date)
{
  var now=new Date()
  released_date.setDate(released_date.getDate()+14)
  return released_date>now
}

function TODO_new_released()
{
  for(let i=0;i<COTELE_PARIS.length;i++)
  {
    if (IsNewProduct(new Date(COTELE_PARIS[i].released)))
    {
      return true
    }
  }
  return false
}

console.log("new product in data:",TODO_new_released())

// 🎯 TODO: Reasonable price
// // 1. Log if coteleparis is a reasonable price shop (true or false)
// // A reasonable price if all the products are less than 100€

console.log("Reasonnable price :",COTELE_PARIS.every((value)=>value.price<=100))

// 🎯 TODO: Find a specific product
// 1. Find the product with the uuid `b56c6d88-749a-5b4c-b571-e5b5c6483131`
// 2. Log the product

console.log("Product :",COTELE_PARIS.find((value)=>value.uuid==`b56c6d88-749a-5b4c-b571-e5b5c6483131`))

// 🎯 TODO: Delete a specific product
// 1. Delete the product with the uuid `b56c6d88-749a-5b4c-b571-e5b5c6483131`
// 2. Log the new list of product

const index_del=COTELE_PARIS.findIndex((value)=>value.uuid==`b56c6d88-749a-5b4c-b571-e5b5c6483131`)
console.log(index_del)
delete(COTELE_PARIS[index_del])
console.log(COTELE_PARIS)

// 🎯 TODO: Save the favorite product
let blueJacket = {
  'link': 'https://coteleparis.com/collections/tous-les-produits-cotele/products/la-veste-bleu-roi',
  'price': 110,
  'uuid': 'b4b05398-fee0-4b31-90fe-a794d2ccfaaa'
};

// we make a copy of blueJacket to jacket
// and set a new property `favorite` to true
let jacket = blueJacket;

jacket.favorite = true;

// 1. Log `blueJacket` and `jacket` variables
// 2. What do you notice?
console.log("Without assign function")

console.log(blueJacket)
console.log(jacket)

blueJacket = {
  'link': 'https://coteleparis.com/collections/tous-les-produits-cotele/products/la-veste-bleu-roi',
  'price': 110,
  'uuid': 'b4b05398-fee0-4b31-90fe-a794d2ccfaaa'
};

// 3. Update `jacket` property with `favorite` to true WITHOUT changing blueJacket properties

console.log("Assign function")
jacket=Object.assign({},blueJacket)
jacket.favorite = true;
console.log(blueJacket)
console.log(jacket)

/**
 * 🎬
 * The End
 * 🎬
 */

// 🎯 TODO: Save in localStorage
// 1. Save MY_FAVORITE_BRANDS in the localStorage
// 2. log the localStorage

localStorage.setItem('MY_FAVORITE_BRANDS', JSON.stringify(MY_FAVORITE_BRANDS));
console.log(JSON.parse(localStorage.getItem('MY_FAVORITE_BRANDS')));
