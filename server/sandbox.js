/* eslint-disable no-console, no-process-exit */
const dedicatedbrand = require('./sources/dedicatedbrand');
const adresseparis = require('./sources/adresseparis');

// async function sandbox (eshop = 'https://www.dedicatedbrand.com/en/men/news') {
async function sandbox (eshop = 'https://adresse.paris/630-toute-la-collection') {

  try {
    console.log(`🕵️‍♀️  browsing ${eshop} source`);

 //   const products = await dedicatedbrand.scrape(eshop);
    const products = await adresseparis.scrape(eshop);

    console.log(products);
    console.log('done');
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

const [,, eshop] = process.argv;

sandbox(eshop);




