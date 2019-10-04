import request from './request';

/**
 * A Class Library for handling Knawat MarketPlace related Operations.
 *
 * @class Suppliers
 */
class Suppliers extends request {
  /**
   * Creates an instance of Suppliers.
   *
   * @param {object} activeInstance
   * @memberof Suppliers
   */
  constructor() {
    super();
    this.authentication = 'Basic';
  }

  /**
   * Get all suppliers
   *
   * @param 
   * @returns
   * @see https://knawat-suppliers.restlet.io/#operation_get_all_suppliers
   * @memberof Suppliers
   */
  getSuppliers() {
    return this.$fetch('GET', `/suppliers`);
  }

  /**
   * Create supplier
   *
   * @param {object}  {"supplier": { "name" : "john", "url": "https://example.com.tr","logo": "https://example.com.tr/logo.png","currency": "TRY", "address": [array of addresses], "contacts": [array of contacts] } }
   * @returns
   * @see https://knawat-suppliers.restlet.io/#operation_create_a_supplier
   * @memberof Suppliers
   */
  createSupplier(supplier) {
    return this.$fetch('POST', `/suppliers`, { supplier });
  }

  
  /**
   * Get supplier keys
   *
   * @param {*} id
   * @returns
   * @see https://knawat-suppliers.restlet.io/#operation_get_suppliers_keys
   * @memberof Suppliers
   */
  getSupplierKeys(id) {
    return this.$fetch('GET', `/suppliers/${id}/keys`);
  }
}

module.exports = Suppliers;
