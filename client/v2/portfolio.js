// Invoking strict mode https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode#invoking_strict_mode
'use strict';

// current products on the page
let currentProducts = [];
let currentPagination = {};
let allProducts=[];
let current_brand="all";


// instantiate the selectors
const selectShow = document.querySelector('#show-select');
const selectPage = document.querySelector('#page-select');
const sectionProducts = document.querySelector('#products');
const spanNbProducts = document.querySelector('#nbProducts');
const selectBrand = document.querySelector('#brand-select');
const checkprice= document.querySelector('#reasonable_price');
const checkreleased= document.querySelector('#recently_released');


/**
 * Set global value
 * @param {Array} result - products to display
 * @param {Object} meta - pagination meta info
 */
const setCurrentProducts = ({result, meta}) => {
  currentProducts = result;
  currentPagination = meta;
  
};

/**
 * Fetch products from api
 * @param  {Number}  [page=1] - current page to fetch
 * @param  {Number}  [size=12] - size of the page
 * @return {Object}
 */
const fetchProducts = async (page = 1, size = 12) => {
  try {
    const response = await fetch(
      `https://clear-fashion-api.vercel.app?page=${page}&size=${size}`
    );
    const body = await response.json();

    if (body.success !== true) {
      console.error(body);
      return {currentProducts, currentPagination};
    }

    return body.data;
  } catch (error) {
    console.error(error);
    return {currentProducts, currentPagination};
  }
};

/**
 * Render list of products
 * @param  {Array} products
 */
const renderProducts = products => {
  if(selectBrand.value!="all"){
    products=GetProdbyBrand(selectBrand.value)
  }
  const fragment = document.createDocumentFragment();
  // if products to display
  if(products.length!=0)
  {
    const div = document.createElement('div');
    const template = products
      .map(product => {
        return `
        <div class="product" id=${product.uuid}>
          <span>${product.brand}</span>
          <a href="${product.link}">${product.name}</a>
          <span>${product.price}</span>
        </div>
      `;
      })
      .join('');
  
    div.innerHTML = template;
    fragment.appendChild(div);
    sectionProducts.innerHTML = '<h2>Products</h2>';
    sectionProducts.appendChild(fragment);
  }
  else // to correct display bug
  {
    const div = document.createElement('div');
    div.innerHTML = "no products available";
    fragment.appendChild(div);
    sectionProducts.innerHTML = '<h2>Products</h2>';
    sectionProducts.appendChild(fragment);
  }
  
};

/**
 * Render page selector
 * @param  {Object} pagination
 */
const renderPagination = pagination => {
  const {currentPage, pageCount} = pagination;
  const options = Array.from(
    {'length': pageCount},
    (value, index) => `<option value="${index + 1}">${index + 1}</option>`
  ).join('');

  selectPage.innerHTML = options;
  selectPage.selectedIndex = currentPage - 1;
};

/**
 * Render page selector
 * @param  {Object} pagination
 */
const renderIndicators = pagination => {
  const {count} = pagination;

  spanNbProducts.innerHTML = count;
};

const render = (products, pagination) => {
  renderProducts(products);
  renderPagination(pagination);
  renderIndicators(pagination);
};


/**
 * Declaration of all Listeners
 */

/**
 * Select the number of products to display
 */
selectShow.addEventListener('change', async (event) => {  
  currentProducts=allProducts.result
  currentProducts=GetCorrectProd(currentPagination.currentPage,parseInt(event.target.value),current_brand)
  currentPagination.pageCount=parseInt(event.target.value)
  render(currentProducts, currentPagination);
});

/**
 * Select the page to display
 */
selectPage.addEventListener('change', async (event) => {
  currentPagination.currentPage=parseInt(event.target.value)
  currentProducts=allProducts.result
  currentProducts=GetCorrectProd(currentPagination.currentPage,currentPagination.pageCount,current_brand)
  document.getElementById("reasonable_price").checked = false;
  document.getElementById("recently_released").checked = false;

  render(currentProducts, currentPagination);
});

/**
 * [FILTER] Select the brand to display
 */
 selectBrand.addEventListener('change', async (event) => {
    currentProducts=allProducts.result
    currentProducts=GetCorrectProd(currentPagination.currentPage,currentPagination.pageCount,event.target.value)
    current_brand=event.target.value
    renderProducts(GetProdbyBrand(event.target.value),currentPagination)
});

/**
 * [Checkbox] Products with price < 50 
 */
 checkprice.addEventListener('change', async (event) => {
  let products=[]
  if (checkprice.checked==true){
    if(checkreleased.checked==true){
      products = FilterDatePrice()
    }
    else{
      products = FilterPrice()
    }  
  }
  else{
    if(checkreleased.checked==true){
      products = FilterDate()
    }
    else{
      products = currentProducts
    }
  }
  renderProducts(products,currentPagination)
});

checkreleased.addEventListener('change', async (event) => {
  let products=[]
  if (checkreleased.checked==true){
    if(checkprice.checked==true){
      products = FilterDatePrice()
    }
    else{
      products = FilterDate()
    } 
  }
  else{
    if(checkprice.checked==true){
      products = FilterPrice()
    }
    else{
      products = currentProducts
    }
  }
  renderProducts(products,currentPagination)
});

/**
 * [Checkbox] Products with released date < 2 weeks
 */

document.addEventListener('DOMContentLoaded', async () => {
  const products = await fetchProducts();
  const a = await fetchProducts(1, 999);
  allProducts=a;
  setProductsOptionFilter(allProducts);
  setCurrentProducts(products);
  render(currentProducts, currentPagination);
});



/**
 * Declaration of various function to answer features
 */

function setProductsOptionFilter(products){
  let brand_name=GetBrands(products["result"])
  for (let i=0;i<brand_name.length;i++){
    var x=document.getElementById("brand-select");
    // create option using DOM
    const newOption = document.createElement('option');
    const optionText = document.createTextNode(brand_name[i]);
    // set option text
    newOption.appendChild(optionText);
    // and option value
    newOption.setAttribute('value',brand_name[i]);
    // add the option to the select box
    x.appendChild(newOption);
  }
}

function GetBrands(marketplace){
  let brand_name=[];
  for (let i=0; i<marketplace.length;i++)
  {
    if (!brand_name.includes(marketplace[i].brand))
    {
      brand_name.push(marketplace[i].brand);
    }
  }
  return(brand_name);
}

function GetCorrectProd(nb_page,len_page,brand)
{
  let dico=GetProdbyBrand(brand)
  let new_prod=[]
  for(let i=(nb_page-1)*(len_page-1);i<(nb_page-1)*(len_page-1)+(len_page)-1;i++)
  {
    if (dico[i]==null){
      break;
    }
    else{
      new_prod.push(dico[i])
    }
  }
  console.log("new",new_prod)
  return new_prod
}

function GetProdbyBrand(brand){
  let product_list=[];
  for (let i=0;i<currentProducts.length;i++)
  {
    if(brand=='all'){
      product_list.push(currentProducts[i])
    }
    else if (currentProducts[i].brand == brand){
      product_list.push(currentProducts[i])
    }
  }
  return product_list
}

function FilterPrice(){
  let products=currentProducts.filter(x=>x.price<50)
  return products
}

function FilterDate(){
  let products=currentProducts.filter(x=>new Date(x.released).getTime()>new Date(Date.now() - 12096e5))
  return products
}

function FilterDatePrice()
{
  let products=currentProducts.filter(x=>new Date(x.released).getTime()>new Date(Date.now() - 12096e5) && x.price<50)
  return products
}