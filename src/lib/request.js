import fetch from 'node-fetch';
import querystring from 'querystring';
import config from './config';

/**
 * A Class Library for handling Knawat MarketPlace related Operations.
 *
 * @class Request
 */
class Request {
  static baseUrl = config.SUPPLIERS_API_URL ;
  headers = config.HEADERS;
  authentication = 'Bearer'
  
  /**
   * Fetch data from server
   *
   * @param {string} method
   * @param {string} path
   * @param {object} options
   */
  $fetch(method, path, options = {}) {
    let url = `${Request.baseUrl}${path}`;
    if(this.authentication === 'Basic'){
      if (!config.BASIC_USER || !config.BASIC_PASS) {
        throw new Error('no a valid Username and Password');
      }
      const AUTH = Buffer.from(`${config.BASIC_USER}:${config.BASIC_PASS}`).toString('base64');
      this.headers.authorization = `Basic ${AUTH}`;
    }
    let fetchOptions = {
      method: method,
      headers: this.headers
    };
    if(method.toUpperCase() === 'GET' && Object.keys(options).length > 0){
      // Generate url query paramaters
      const queryParams = querystring.stringify(options);
      url = `${url}?${queryParams}`;
    }
    else{
      fetchOptions = {...fetchOptions, ...options}
    }
    return fetch(url, fetchOptions)
    .then(res => res.json())
    .catch(error => {
        throw error;
      });
  }
}

module.exports = Request;
