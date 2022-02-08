// Invoking strict mode https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode#invoking_strict_mode
'use strict';

// current products on the page
let currentProducts = [];
let currentPagination = {};
let allProducts=[];

// instantiate the selectors
const selectShow = document.querySelector('#show-select');
const selectPage = document.querySelector('#page-select');
const sectionProducts = document.querySelector('#products');
const spanNbProducts = document.querySelector('#nbProducts');
const selectBrand = document.querySelector('#brand-select');

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

function GetProdbyBrand(brand){
  let product_list=[];
  for (let i=0;i<currentProducts.length;i++)
  {
    if (currentProducts[i].brand == brand){
      product_list.push(currentProducts[i])
    }
  }
  return product_list
}

/**
 * Declaration of all Listeners
 */

/**
 * Select the number of products to display
 */
selectShow.addEventListener('change', async (event) => {  
  const products = await fetchProducts(currentPagination.currentPage, parseInt(event.target.value));
  setCurrentProducts(products);
  render(currentProducts, currentPagination);
});

/**
 * Select the page to display
 */
selectPage.addEventListener('change', async (event) => {
  const products = await fetchProducts(parseInt(event.target.value), currentPagination.pageSize);
  setCurrentProducts(products);
  render(currentProducts, currentPagination);
});

/**
 * [FILTER] Select the brand to display
 */
 selectBrand.addEventListener('change', async (event) => {
  if (event.target.value!="all"){
    renderProducts(GetProdbyBrand(event.target.value))
  }
  else{
    const products = await fetchProducts(currentPagination.currentPage, currentPagination.pageSize);
    setCurrentProducts(products);
    render(currentProducts, currentPagination);
  }
});

document.addEventListener('DOMContentLoaded', async () => {
  const products = await fetchProducts();
  const a = await fetchProducts(1, 999);
  allProducts=a;
  console.log(allProducts)
  console.log(products)
  setProductsOptionFilter(allProducts);
  setCurrentProducts(products);
  //setProductsOptionFilter(products);
  render(currentProducts, currentPagination);
});



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