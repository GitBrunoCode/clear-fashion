// Invoking strict mode https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode#invoking_strict_mode
"use strict";

// current products on the page
let currentProducts = [];
let currentPagination = {};
let currentSize = 12;
let currentPageCount = 0;

// instantiate the selectors
const selectShow = document.querySelector("#show-select");
const selectPage = document.querySelector("#page-select");
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
const fetchProducts = async (page = 1, size = 12) => {
  try {
    const response = await fetch(
      `http://localhost:8092/products/search?page=${page}&size=${size}`
    );
    const body = await response.json();
    return body;
  } catch (error) {
    console.error(error);
    return { currentProducts, currentPagination };
  }
};

const fetchDBInfo = async () => {
  try {
    const response = await fetch(`http://localhost:8092/products/info`);
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
  const products = await fetchProducts(
    currentPagination.currentPage,
    parseInt(event.target.value)
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
    currentSize
  );
  setCurrentProducts(products);
  render(currentProducts, currentPagination);
});

document.addEventListener("DOMContentLoaded", async () => {
  const products = await fetchProducts();
  setCurrentProducts(products);
  render(currentProducts, currentPagination);
});
