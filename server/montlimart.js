const montlimart = require('montlimart');
let products = []
    for(let i=1;i<9;i++)
    {
      let productspage=await montlimart.scrape(eshop+"?p="+i);
      for(let j=0;j<productspage.length;j++)
      {
        products.push(productspage[j])
      }
    }

products.forEach(product => {
  console.log(products.name);
})