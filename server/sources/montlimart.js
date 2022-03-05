const fetch = require('node-fetch');
const cheerio = require('cheerio');
const {'v5': uuidv5} = require('uuid');

/**
 * Parse webpage e-shop
 * @param  {String} data - html response
 * @return {Array} products
 */
const parse = data => {
  const $ = cheerio.load(data);

  return $('.category-products .products-grid .item ')
    .map((i, element) => {
      let name = $(element)
        .find('.product-info a')
        .text()
        .trim()
        .replace(/\s/g, ' ').split("  ");    
      let color=name[name.length-1]
      name=(name[0]+color).toString()
      name=name.toLowerCase();
      let photo= $(element)
        .find('.product-image img')
        .attr('src');
      const price = parseInt(
          $(element)
            .find('.price')
            .text()
      );
      let brand="montlimart"
      let link= $(element).find('a').attr('href');
      if(isNaN(price)==false)
      {
        let uuid= uuidv5(link, uuidv5.URL)
        let date=new Date().toISOString().slice(0,10)
        return {link,brand,price,name,photo,uuid,date};
      }
    })
    .get();
};

/**
 * Scrape all the products for a given url page
 * @param  {[type]}  url
 * @return {Array|null}
 */
module.exports.scrape = async url => {
  try {
    const response = await fetch(url);

    if (response.ok) {
      const body = await response.text();

      return parse(body);
    }

    console.error(response);

    return null;
  } catch (error) {
    console.error(error);
    return null;
  }
};
