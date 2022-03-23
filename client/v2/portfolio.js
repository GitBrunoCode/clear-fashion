// Invoking strict mode https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode#invoking_strict_mode
"use strict";

// current products on the page
let currentProducts = [];
let currentPagination = {};
let currentSize = 12;
let currentPageCount = 0;
let currentBrand = "all";
let currentFilter = "price_asc";
let currentOtherFilter = "none";
let favProducts = [];
var favOnly = false;

// instantiate the selectors
const selectShow = document.querySelector("#show-select");
const selectPage = document.querySelector("#page-select");
const selectBrand = document.querySelector("#brand-select");
const selectFilter = document.querySelector("#sort-select");
const selectOtherFilter = document.querySelector("#limit-select");
const sectionProducts = document.querySelector("#products");
const spanNbProducts = document.querySelector("#nbProducts");
const span50 = document.querySelector("#p50");
const span90 = document.querySelector("#p90");
const span95 = document.querySelector("#p95");
const spanLastRelease = document.querySelector("#last_release");
const spanNew = document.querySelector("#new");
/**
 * Set global value
 * @param {Array} result - products to display
 * @param {Object} meta - pagination meta info
 */
const setCurrentProducts = ({ pagecount, currentPage, pageSize, products }) => {
  currentProducts = products;
  currentPagination = currentPage;
  currentSize = pageSize;
  currentPageCount = pagecount;
};

/**
 * Fetch products from api
 * @param  {Number}  [page=1] - current page to fetch
 * @param  {Number}  [size=12] - size of the page
 * @return {Object}
 */
const fetchProducts = async (
  page = 1,
  size = 12,
  brand = "all",
  filter = "price_asc",
  otherfilter = "none"
) => {
  try {
    var query = `https://server-pearl-three.vercel.app/products/search?page=${page}&size=${size}&sort=${filter}&otherfilter=${otherfilter}`;
    if (brand != "all") {
      query += `&brand=${brand}`;
    }
    console.log(query);
    const response = await fetch(query);
    const body = await response.json();
    return body;
  } catch (error) {
    console.error(error);
    return { currentProducts, currentPagination };
  }
};

const fetchFavProducts = async (favProducts) => {
  let favProductsInfo = [];
  for (let i = 0; i < favProducts.length; i++) {
    let id = favProducts[i];
    try {
      var query = `https://server-pearl-three.vercel.app/products/${id}`;
      console.log(query);
      const response = await fetch(query);
      const body = await response.json();
      favProductsInfo.push(body[0]);
    } catch (error) {
      console.error(error);
      return { currentProducts, currentPagination };
    }
  }
  return favProductsInfo;
};

const fetchDBInfo = async () => {
  try {
    const response = await fetch(
      `https://server-pearl-three.vercel.app/products/info`
    );
    const body = await response.json();
    return body;
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
  const fragment = document.createDocumentFragment();
  const div = document.createElement("div");
  console.log(products);

  const template = products
    .map((product) => {
      if (product.brand == "loom") {
        console.log("aaaa");
        product["photo"] = "https:" + product["photo"];
        console.log(product);
      }
      if (favProducts.includes(product._id)) {
        return `
      <div class="product" id=${product._id}>
      <input id="cb${product._id}" class="star" type="checkbox" title="bookmark page" onclick="addToFav(this.id)" checked>
        <span>${product.brand}</span>
        <a href="${product.link}" target="_blank">${product.name}</a>
        <span>${product.price}€</span>
        <img src="${product.photo}" width="300" height="300"  alt=""/>
      </div>
    `;
      } else {
        return `
      <div class="product" id=${product._id}>
      <input id="cb${product._id}" class="star" type="checkbox" title="bookmark page" onclick="addToFav(this.id)" style="display:block; margin:auto;">
        <span class="span2">👔 Brand: ${product.brand}</span>
        <div align="center">
        <a class="span2" href="${product.link}" target="_blank">👕 ${product.name}</a>
        </div>
        <span class="span2">💰 Price: ${product.price}€</span>
        <p margin-left: 50%; align="center">
        <img src="${product.photo}"  height="300" alt=""/>
      </div>
      <div id="trait_dessus"><hr></div>
      <div id="trait_dessus"><hr></div>
      <br>
    `;
      }
    })
    .join("");

  div.innerHTML = template;
  fragment.appendChild(div);
  sectionProducts.innerHTML = '<h2 class="title">🟠 Products</h2>';
  sectionProducts.appendChild(fragment);
};

/**
 * Render page selector
 * @param  {Object} pagination
 */
const renderPagination = (pagination) => {
  const options = Array.from(
    { length: currentPageCount },
    (value, index) => `<option value="${index + 1}">${index + 1}</option>`
  ).join("");
  selectPage.innerHTML = options;
  selectPage.selectedIndex = pagination - 1;
};

/**
 * Render indicator selector
 * @param  {Object} pagination
 */
const renderIndicators = async (pagination) => {
  const result = await fetchDBInfo();
  spanNbProducts.innerHTML = result["nb_products"];
  spanLastRelease.innerHTML = result["last released"];
  spanNew.innerHTML = result["nb_new_products"];
  span50.innerHTML = result["Q50"];
  span90.innerHTML = result["Q90"];
  span95.innerHTML = result["Q95"];
  let brand_list = result["brands"];
  for (let i = 0; i < brand_list.length; i++) {
    var section = document.getElementById("brand-select");
    const newOption = document.createElement("option");
    const newOptionText = document.createTextNode(brand_list[i]);
    newOption.appendChild(newOptionText);
    newOption.setAttribute("value", brand_list[i]);
    section.appendChild(newOption);
  }
};

const render = (products, pagination) => {
  renderProducts(products);
  renderPagination(pagination);
};

const renderFav = (products) => {
  renderProducts(products);
};
/**
 * Declaration of all Listeners
 */

/**
 * Select the number of products to display
 */
selectShow.addEventListener("change", async (event) => {
  const products = await fetchProducts(
    currentPagination.currentPage,
    parseInt(event.target.value),
    currentBrand,
    currentFilter,
    currentOtherFilter
  );
  setCurrentProducts(products);
  render(currentProducts, currentPagination);
});
/**
 * Select the page to display
 */
selectPage.addEventListener("change", async (event) => {
  const products = await fetchProducts(
    parseInt(event.target.value),
    currentSize,
    currentBrand,
    currentFilter,
    currentOtherFilter
  );
  setCurrentProducts(products);
  render(currentProducts, currentPagination);
});

selectBrand.addEventListener("change", async (event) => {
  const products = await fetchProducts(
    currentPagination.currentPage,
    currentSize,
    event.target.value,
    currentFilter,
    currentOtherFilter
  );
  currentBrand = event.target.value;
  setCurrentProducts(products);
  render(currentProducts, currentPagination);
});

selectFilter.addEventListener("change", async (event) => {
  const products = await fetchProducts(
    currentPagination.currentPage,
    currentSize,
    currentBrand,
    event.target.value,
    currentOtherFilter
  );
  currentFilter = event.target.value;
  setCurrentProducts(products);
  render(currentProducts, currentPagination);
});

selectOtherFilter.addEventListener("change", async (event) => {
  const products = await fetchProducts(
    currentPagination.currentPage,
    currentSize,
    currentBrand,
    currentFilter,
    event.target.value
  );
  currentOtherFilter = event.target.value;
  setCurrentProducts(products);
  render(currentProducts, currentPagination);
});

document.addEventListener("DOMContentLoaded", async () => {
  const products = await fetchProducts();
  setCurrentProducts(products);
  render(currentProducts, currentPagination);
  renderIndicators(currentPagination);
});

function addToFav(id) {
  var checkBox = document.getElementById(id);
  id = id.substring(2);
  if (checkBox.checked) {
    favProducts.push(id);
    alert("👕 Product added to favorites !👕");
  } else {
    const index = favProducts.indexOf(id);
    favProducts.splice(index, 1);
    alert("👕 Product removed from favorites !👕");
  }
  console.log(favProducts);
}

async function dispFav() {
  dispDiv("filters");
  dispDiv("filters_price_released");
  dispDiv("sort");
  dispDiv("brand");
  dispDiv("page");
  dispDiv("show");
  const btn=document.getElementById("btn")
  if (favOnly == false) {
    favOnly = true;
    const products = await fetchFavProducts(favProducts);
    btn.innerText = "Click Here to show all products";
    renderFav(products);
  } else {
    favOnly = false;
    const products = await fetchProducts(
      currentPagination.currentPage,
      currentSize,
      currentBrand,
      currentFilter,
      currentOtherFilter
    );
    btn.innerText = "Click Here to show your favorite(s) Only";
    setCurrentProducts(products);
    render(currentProducts, currentPagination);
  }
  console.log(favOnly);
}

function dispDiv(id) {
  const targetDiv = document.getElementById(id);
  if (targetDiv.style.display !== "none") {
    targetDiv.style.display = "none";
  } else {
    targetDiv.style.display = "block";
  }
}
