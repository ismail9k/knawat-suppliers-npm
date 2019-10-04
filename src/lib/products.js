import querystring from 'querystring';
import request from './request';

/**
 * A Class Library for handling Knawat MarketPlace related Operations.
 *
 * @class Products
 */
class Products extends request {

  /**
   * Creates an instance of Products.
   *
   * @param {object} activeInstance
   * @memberof Products
   */
  constructor({ key, secret, token }) {
    super();
    if ((!key || !secret) && !token) {
      throw new Error('Not a valid consumerKey and consumerSecret or token');
    }

    this.consumerKey = key;
    this.consumerSecret = secret;
    this.token = token;
    
  }

  /**
   * Generate access token from store key and secret
   *
   * @readonly
   * @memberof Products
   */
  get token() {
    if (!this.myToken) {
      return this.refreshToken();
    }

    return this.myToken;
  }

  set token(val) {
    if (!val) {
      val = this.token
    }
    this.myToken = val;
    this.headers.authorization = `Bearer ${val}`;
  }

  /**
   * Generates a new access token
   *
   * @returns
   * @memberof Products
   */
  refreshToken() {
    return this.$fetch('POST', '/token', {
      body: JSON.stringify({
        key: this.consumerKey,
        secret: this.consumerSecret
      })
    }).then(({ user }) => {
      this.token = user.token;
      return user.token;
    });
  }


  /**
   * Update supplier
   *
   *  @param {object}  {"supplier": { "name" : "john", "url": "https://example.com.tr","logo": "https://example.com.tr/logo.png","currency": "TRY", "address": [array of addresses], "contacts": [array of contacts] } }
   * @returns
   * @see https://knawat-suppliers.restlet.io/#operation_update_a_supplier_2
   * @memberof Products
   */
  updateSupplier(supplier) {
    return this.$fetch('PUT', `/suppliers`,{supplier});
  }

  /**
   * Get all imported products
   *
   * @param {object} {
   *     limit = 10
   *     page = 1,
   *     qualified = 1: Qualified, 2: Needs to review, 4: Disqualified, 5 : Draft,
   *     category_id = 1,57 / -1,
   *     keyword = "mavi",
   *     stock = { stock_from: 12, stock_to: 50},
   *     price = { price_from: 12, price_to: 50},
   *     sort_by = name/ stock/ qualified/ price/ stock,
   *     sort_asc = 1/-1,
   *     language = tr/ en/ ar
   *   }
   * @returns
   * @see https://knawat-suppliers.restlet.io/#operation_get_list_of_products
   * @memberof Products
   */
  getProducts({
    limit = 10,
    page = 1,
    qualified = null,
    category_id = null,
    keyword = null,
    stock = null,
    price = null,
    sort_by = null,
    sort_asc = null,
    language = "tr"
  } = {}) {
    // Generate url query paramaters
    let queryParams = {
      limit,
      page,
      qualified,
      category_id,
      keyword,
      stock,
      price,
      sort_by,
      sort_asc,
      language
    };
    Object.entries(queryParams).forEach( o => (o[1] === null ? delete queryParams[o[0]] : 0));
    return this.$fetch('GET', `/catalog/products`,queryParams);
  }

  /**
   * Get product by sku
   *
   * @param {string} sku
   * @returns
   * @see https://knawat-suppliers.restlet.io/#operation_get_product_by_sku
   * @memberof Products
   */
  getProductBySku(sku) {
    return this.$fetch('GET', `/catalog/products/${sku}`);
  }

  /**
   * Add product(s) to my list
   *
   * @param {array*} products
   * @returns
   * @see https://knawat-suppliers.restlet.io/#operation_add_to_my_products
   * @memberof Products
   */
  addProducts(products) {
    return this.$fetch('POST', '/catalog/products', {
      body: JSON.stringify({
        products
      })
    });
  }

  /**
   * Update product external IDs by SKU
   *
   * @param {*} data
   * @returns
   * @see https://knawat-suppliers.restlet.io/#operation_update_product
   * @memberof Products
   */
  updateProductBySku(sku, data) {
    return this.$fetch('PUT', `/catalog/update/${sku}`, {
      body: JSON.stringify({ data })
    });
  }

  /**
   * Bulk product update
   *
   * @param {*} data
   * @returns
   * @see
   * @memberof Products
   */
  updateBulkProduct(data) {
    return this.$fetch('PATCH', `/catalog/products`, {
      body: JSON.stringify(data)
    });
  }

  /**
   * Get all catalog categories
   *
   * @returns
   * @see https://knawat-suppliers.restlet.io/#operation_get_list_of_categories
   * @memberof Products
   */
  getCategories({
    parentId = null,
    level = null
  } = {}) {
    // get query paramaters
    let queryParams = {};
    if(parentId && parentId > 0){
      queryParams.parentId = parentId
    }
    if(level && level > 0){
      queryParams.level = level
    }
    return this.$fetch('GET', `/catalog/categories`, queryParams);
  }

  /**
   *  Get all current orders
   *
   * @param {number} [limit=25]
   * @param {number} [page=1]
   * @returns
   * @see https://knawat-suppliers.restlet.io/#operation_get_order_s_
   * @memberof Products
   */
  getOrders(limit = 25, page = 1) {
    const params = querystring.stringify({ limit, page });
    return this.$fetch('GET', `/orders?${params}`);
  }

  /**
   * Get order by id
   *
   * @param {string} id
   * @returns
   * @see https://knawat-suppliers.restlet.io/#operation_order_by_id
   * @memberof Products
   */
  getOrderById(id) {
    return this.$fetch('GET', `/orders/${id}`);
  }

  /**
   * Cancel order by id
   *
   * @param {string} id
   * @returns
   * @see https://knawat-suppliers.restlet.io/#operation_order_by_id
   * @memberof Products
   */
  cancelOrder(id) {
    return this.$fetch('DELETE', `/orders/${id}`);
  }

  /**
   * Create new order
   *
   * @param {array} data
   * @returns
   * @see https://knawat-suppliers.restlet.io/#operation_create_order
   * @memberof Products
   */
  createOrder(data) {
    return this.$fetch('POST', '/orders', {
      body: JSON.stringify(data)
    });
  }

  /**
   * Update current order
   *
   * @param {string} orderId
   * @param {array} data
   * @returns
   * @see https://knawat-suppliers.restlet.io/#operation_update_order
   * @memberof Products
   */
  updateOrder(orderId, data) {
    return this.$fetch('PUT', `/orders/${orderId}`, {
      body: JSON.stringify(data)
    });
  }
}

module.exports = Products;
