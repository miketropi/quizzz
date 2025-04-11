import axios from 'axios';

/**
 * Base API class for handling HTTP requests
 */
class API {
  /**
   * Create a new API instance
   * @param {Object} config - Configuration for the API
   * @param {string} config.baseURL - Base URL for API requests
   * @param {Object} config.headers - Default headers for requests
   * @param {number} config.timeout - Request timeout in milliseconds
   * @param {Function} config.onRequest - Callback before request is sent
   * @param {Function} config.onResponse - Callback after response is received
   * @param {Function} config.onError - Callback when error occurs
   */
  constructor(config = {}) {
    const {
      baseURL = '',
      headers = {},
      timeout = 30000,
      onRequest = null,
      onResponse = null,
      onError = null,
    } = config;

    this.baseURL = baseURL;
    this.headers = headers;
    this.timeout = timeout;
    
    // Create axios instance with config
    this.client = axios.create({
      baseURL: this.baseURL,
      headers: this.headers,
      timeout: this.timeout,
    });

    // Setup interceptors if callbacks provided
    if (onRequest || onResponse || onError) {
      this._setupInterceptors(onRequest, onResponse, onError);
    }
  }

  /**
   * Setup axios interceptors
   * @private
   */
  _setupInterceptors(onRequest, onResponse, onError) {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        if (onRequest) {
          config = onRequest(config) || config;
        }
        return config;
      },
      (error) => {
        if (onError) {
          return onError(error);
        }
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => {
        if (onResponse) {
          return onResponse(response) || response;
        }
        return response;
      },
      (error) => {
        if (onError) {
          return onError(error);
        }
        return Promise.reject(error);
      }
    );
  }

  /**
   * Get request
   * @param {string} endpoint - API endpoint
   * @param {Object} config - Additional configuration
   * @returns {Promise} - Axios promise
   */
  get(endpoint, config = {}) {
    return this.client.get(endpoint, config);
  }

  /**
   * Post request
   * @param {string} endpoint - API endpoint
   * @param {Object} data - Request payload
   * @param {Object} config - Additional configuration
   * @returns {Promise} - Axios promise
   */
  post(endpoint, data = {}, config = {}) {
    return this.client.post(endpoint, data, config);
  }

  /**
   * Put request
   * @param {string} endpoint - API endpoint
   * @param {Object} data - Request payload
   * @param {Object} config - Additional configuration
   * @returns {Promise} - Axios promise
   */
  put(endpoint, data = {}, config = {}) {
    return this.client.put(endpoint, data, config);
  }

  /**
   * Delete request
   * @param {string} endpoint - API endpoint
   * @param {Object} config - Additional configuration
   * @returns {Promise} - Axios promise
   */
  delete(endpoint, config = {}) {
    return this.client.delete(endpoint, config);
  }

  /**
   * Patch request
   * @param {string} endpoint - API endpoint
   * @param {Object} data - Request payload
   * @param {Object} config - Additional configuration
   * @returns {Promise} - Axios promise
   */
  patch(endpoint, data = {}, config = {}) {
    return this.client.patch(endpoint, data, config);
  }

  /**
   * Set authentication token
   * @param {string} token - Authentication token
   * @param {string} type - Token type (default: 'Bearer')
   */
  setAuthToken(token, type = 'Bearer') {
    if (token) {
      this.client.defaults.headers.common['Authorization'] = `${type} ${token}`;
    } else {
      delete this.client.defaults.headers.common['Authorization'];
    }
  }

  /**
   * Set a custom header
   * @param {string} name - Header name
   * @param {string} value - Header value
   */
  setHeader(name, value) {
    this.client.defaults.headers.common[name] = value;
  }

  /**
   * Remove a custom header
   * @param {string} name - Header name
   */
  removeHeader(name) {
    delete this.client.defaults.headers.common[name];
  }
}

export default API;
