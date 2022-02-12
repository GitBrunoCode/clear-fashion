// Invoking strict mode https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode#invoking_strict_mode
"use strict";

// current products on the page
let currentProducts = [];
let currentPagination = {};
let allProducts = [];
let current_brand = "all";
let current_sort = "normal";

// instantiate the selectors
const selectShow = document.querySelector("#show-select");
const selectPage = document.querySelector("#page-select");
const sectionProducts = document.querySelector("#products");
const spanNbProducts = document.querySelector("#nbProducts");
const selectBrand = document.querySelector("#brand-select");
const checkprice = document.querySelector("#reasonable_price");
const checkreleased = document.querySelector("#recently_released");
const selectSort = document.querySelector("#sort-select");
const span50 = document.querySelector("#p50");
const span90 = document.querySelector("#p90");
const span95 = document.querySelector("#p95");
const spanNew = document.querySelector("#new");
const spanLastRelease = document.querySelector("#last_release");

/**
 * Set global value
 * @param {Array} result - products to display
 * @param {Object} meta - pagination meta info
 */
const setCurrentProducts = ({ result, meta }) => {
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
      return { currentProducts, currentPagination };
    }

    return body.data;
  } catch (error) {
    console.error(error);
    return { currentProducts, currentPagination };
  }
};

/**
 * Render list of products
 * @param  {Array} products
 */
const renderProducts = (products) => {
  if (selectBrand.value != "all") {
    products = GetProdbyBrand(selectBrand.value);
  }
  const fragment = document.createDocumentFragment();
  // if products to display
  if (products.length != 0) {
    const div = document.createElement("div");
    const template = products
      .map((product) => {
        return `
        <div class="product" id=${product.uuid}>
          <span>${product.brand}</span>
          <a href="${product.link}">${product.name}</a>
          <span>${product.price}</span>
        </div>
      `;
      })
      .join("");

    div.innerHTML = template;
    fragment.appendChild(div);
    sectionProducts.innerHTML = "<h2>Products</h2>";
    sectionProducts.appendChild(fragment);
  } // to correct display bug
  else {
    const div = document.createElement("div");
    div.innerHTML = "no products available";
    fragment.appendChild(div);
    sectionProducts.innerHTML = "<h2>Products</h2>";
    sectionProducts.appendChild(fragment);
  }
};

/**
 * Render page selector
 * @param  {Object} pagination
 */
const renderPagination = (pagination) => {
  const { currentPage, pageCount } = pagination;
  const options = Array.from(
    { length: pageCount },
    (value, index) => `<option value="${index + 1}">${index + 1}</option>`
  ).join("");

  selectPage.innerHTML = options;
  selectPage.selectedIndex = currentPage - 1;
};

/**
 * Render page selector
 * @param  {Object} pagination
 */
const renderIndicators = (pagination) => {
  const { count } = pagination;
  spanNbProducts.innerHTML = count;

  let product_sort = Object.assign({}, allProducts.result);
  let arr = [];
  for (var key in product_sort) {
    arr.push(product_sort[key]);
  }
  arr.sort(price_sort_up);
  const p50 = pCalculator(arr, 50);
  const p90 = pCalculator(arr, 90);
  const p95 = pCalculator(arr, 95);
  span50.innerHTML = p50;
  span90.innerHTML = p90;
  span95.innerHTML = p95;

  arr.sort(date_sort_down);
  console.log(arr);
  spanLastRelease.innerHTML = arr[0].released;
  spanNew.innerHTML = getNbNewReleased(arr);
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
selectShow.addEventListener("change", async (event) => {
  currentProducts = allProducts.result;
  currentProducts = GetCorrectProd(
    currentPagination.currentPage,
    parseInt(event.target.value),
    current_brand
  );
  currentPagination.pageCount = parseInt(event.target.value);
  render(currentProducts, currentPagination);
});

/**
 * Select the page to display
 */
selectPage.addEventListener("change", async (event) => {
  currentPagination.currentPage = parseInt(event.target.value);
  currentProducts = allProducts.result;
  currentProducts = GetCorrectProd(
    currentPagination.currentPage,
    currentPagination.pageCount,
    current_brand
  );
  render(currentProducts, currentPagination);
});

/**
 * [FILTER] Select the brand to display
 */
selectBrand.addEventListener("change", async (event) => {
  currentProducts = allProducts.result;
  currentProducts = GetCorrectProd(
    currentPagination.currentPage,
    currentPagination.pageCount,
    event.target.value
  );
  current_brand = event.target.value;
  renderProducts(currentProducts, currentPagination);
});

/**
 * [Checkbox] Products with price < 50
 */
checkprice.addEventListener("change", async (event) => {
  currentProducts = allProducts.result;
  currentProducts = GetCorrectProd(
    currentPagination.currentPage,
    currentPagination.pageCount,
    current_brand
  );
  renderProducts(currentProducts, currentPagination);
});

/**
 * [Checkbox] released less than 2 weeks ago
 */
checkreleased.addEventListener("change", async (event) => {
  currentProducts = allProducts.result;
  currentProducts = GetCorrectProd(
    currentPagination.currentPage,
    currentPagination.pageCount,
    current_brand
  );
  renderProducts(currentProducts, currentPagination);
});

/**
 * [Checkbox] released less than 2 weeks ago
 */
selectSort.addEventListener("change", async (event) => {
  current_sort = event.target.value;
  currentProducts = allProducts.result;
  currentProducts = GetCorrectProd(
    currentPagination.currentPage,
    currentPagination.pageCount,
    current_brand
  );
  renderProducts(currentProducts, currentPagination);
});

document.addEventListener("DOMContentLoaded", async () => {
  const products = await fetchProducts();
  const a = await fetchProducts(1, 999);
  allProducts = a;
  setProductsOptionFilter(allProducts);
  setCurrentProducts(products);
  render(currentProducts, currentPagination);
});

/**
 * Declaration of various function to answer features
 */

function setProductsOptionFilter(products) {
  let brand_name = GetBrands(products["result"]);
  for (let i = 0; i < brand_name.length; i++) {
    var x = document.getElementById("brand-select");
    // create option using DOM
    const newOption = document.createElement("option");
    const optionText = document.createTextNode(brand_name[i]);
    // set option text
    newOption.appendChild(optionText);
    // and option value
    newOption.setAttribute("value", brand_name[i]);
    // add the option to the select box
    x.appendChild(newOption);
  }
}

function GetBrands(marketplace) {
  let brand_name = [];
  for (let i = 0; i < marketplace.length; i++) {
    if (!brand_name.includes(marketplace[i].brand)) {
      brand_name.push(marketplace[i].brand);
    }
  }
  return brand_name;
}

function GetCorrectProd(nb_page, len_page, brand) {
  let dico = GetProdbyBrand(brand);
  let new_prod = [];
  for (
    let i = (nb_page - 1) * (len_page - 1);
    i < (nb_page - 1) * (len_page - 1) + len_page - 1;
    i++
  ) {
    if (dico[i] == null) {
      break;
    } else {
      new_prod.push(dico[i]);
    }
  }

  return new_prod;
}

function GetProdbyBrand(brand) {
  let product_list = [];
  let products = [];

  if (checkreleased.checked == true && checkprice.checked == true) {
    products = FilterDatePrice(currentProducts.slice());
  } else if (checkprice.checked == true) {
    products = FilterPrice(currentProducts.slice());
  } else if (checkreleased.checked == true) {
    products = FilterDate(currentProducts.slice());
  } else {
    products = currentProducts;
  }

  if (current_sort == "price-asc") {
    SortByPrice(products, true);
  } else if (current_sort == "price-desc") {
    SortByPrice(products, false);
  } else if (current_sort == "date-asc") {
    SortByDate(products, true);
  } else if (current_sort == "date-desc") {
    SortByDate(products, false);
  }

  for (let i = 0; i < products.length; i++) {
    if (brand == "all") {
      product_list.push(products[i]);
    } else if (products[i].brand == brand) {
      product_list.push(products[i]);
    }
  }
  return product_list;
}

function FilterPrice(product) {
  let products = product.filter((x) => x.price < 50);
  return products;
}

function FilterDate(product) {
  let products = product.filter(
    (x) => new Date(x.released).getTime() > new Date(Date.now() - 12096e5).getTime()
  );
  return products;
}

function FilterDatePrice(product) {
  let products = product.filter(
    (x) =>
      new Date(x.released).getTime() > new Date(Date.now() - 12096e5).getTime() &&
      x.price < 50
  );
  return products;
}

function SortByPrice(product, up) {
  if (up == true) {
    Object.assign({}, product.sort(price_sort_down));
  } else {
    Object.assign({}, product.sort(price_sort_up));
  }
  console.log(product);
}

function SortByDate(product, up) {
  if (up == true) {
    Object.assign({}, product.sort(date_sort_up));
  } else {
    Object.assign({}, product.sort(date_sort_down));
  }
}

function price_sort_up(a, b) {
  return a.price - b.price;
}
function price_sort_down(a, b) {
  return b.price - a.price;
}

function date_sort_up(a, b) {
  return new Date(a.released).getTime() - new Date(b.released).getTime();
}

function date_sort_down(a, b) {
  return new Date(b.released).getTime() - new Date(a.released).getTime();
}

function pCalculator(products, pvalue) {
  const index = Math.floor(products.length * (pvalue / 100));
  return products[index].price;
}

function getNbNewReleased(arr) {
  let nb = 0;
  for (let i = 0; i < arr.length; i++) {
    if (new Date(arr[i].released).getTime() > new Date(Date.now()-12096e5).getTime()) {
      nb++;
    } else {
      break;
    }
  }
  console.log(nb)
  return nb;
}
