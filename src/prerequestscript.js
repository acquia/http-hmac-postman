/*
 * HTTP-HMAC-POSTMAN
 * VERSION: 1.0.1
 *
 * To use this script, paste it into the Postman pre-script editor
 * *AND* add these headers to the request
 *   Authorization:{{acqHmacHeader}}
 *   X-Authorization-Timestamp:{{acqHmacTimestamp}}
 *   X-Authorization-Content-SHA256:{{acqHmacContentSha}}
 *
 *   This code sets the Postman environment variables:
 *     {{acqHmacHeader}}
 *     {{acqHmacContentSha}}
 *     {{acqHmacTimestamp}}
 *     {{acqAccountID}} (only required for Acquia Lift decisions API)
 *
 *   This code expects these Postman environement variables to be set:
 *     {{hmacKey}} defaults to 'key'
 *     {{hmacSecret}} defaults to 'secret'
 *     {{secretIsBase64encoded}} defaults to true
 *     {{acquiaLiftAccountId}} defaults to '' (only required for Acquia Lift decisions API)
 *
 *   This code replaces Postman variables in url and body text before HMAC encoding
 *
 *   Note: Only HMAC version 2.0 is supported
 *
 *   Notes for using this script to connect to Acquia Commerce Connetore Service
 *      1. Create Postman environment Variable 'secretIsBase64encoded' set to 'false'
 *      2. Do not base64 encode the HMAC secret
 *
 *   Notes for using this script to connect to Acquia Lift
 *      1. Use a base64 encoded secret
 *      2. Set Postman environment variable acquiaLiftAccountId set to your account ID
 *
 */

var publicKey = postman.getEnvironmentVariable('hmacKey') || 'key';
var secretKey = postman.getEnvironmentVariable('hmacSecret') || 'secret';
var hmacRealm = "Acquia";

//Only required for Acquia Lift Decision API
var acquiaAccountID = postman.getEnvironmentVariable('acquiaLiftAccountId') || '';

// Decide what to do with the secret
var hasAlreadyEncodedSecret = postman.getEnvironmentVariable('secretIsBase64encoded') || true;


//############################################################################
//############################################################################
//####################### DO NOT EDIT BELOW THIS POINT #######################
//############################################################################
//############################################################################

if (hasAlreadyEncodedSecret && hasAlreadyEncodedSecret !== "false")
{
    // do nothing here
}
else
{
    // encode the secret
    // strictly, pre-encoding is incorrect but that is a discussion for another day
    wordArray = CryptoJS.enc.Utf8.parse(secretKey);
    secretKey = CryptoJS.enc.Base64.stringify(wordArray);
}

postman.setEnvironmentVariable('acqAccountID', acquiaAccountID);

//Acquia HMAC LIB https://github.com/acquia/http-hmac-javascript
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

if (!Date.now) {
  Date.now = function () {
    return new Date().getTime();
  };
}
if (!Object.keys) {
  Object.keys = function () {
    'use strict';

    var hasOwnProperty = Object.prototype.hasOwnProperty,
        hasDontEnumBug = !{ toString: null }.propertyIsEnumerable('toString'),
        dontEnums = ['toString', 'toLocaleString', 'valueOf', 'hasOwnProperty', 'isPrototypeOf', 'propertyIsEnumerable', 'constructor'],
        dontEnumsLength = dontEnums.length;

    return function (obj) {
      if ((typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) !== 'object' && (typeof obj !== 'function' || obj === null)) {
        throw new TypeError('Object.keys called on non-object');
      }

      var result = [],
          prop,
          i;

      for (prop in obj) {
        if (hasOwnProperty.call(obj, prop)) {
          result.push(prop);
        }
      }

      if (hasDontEnumBug) {
        for (i = 0; i < dontEnumsLength; i++) {
          if (hasOwnProperty.call(obj, dontEnums[i])) {
            result.push(dontEnums[i]);
          }
        }
      }
      return result;
    };
  }();
}
if (!Array.prototype.forEach) {
  Array.prototype.forEach = function (callback, thisArg) {
    var T, k;

    if (this === null) {
      throw new TypeError(' this is null or not defined');
    }

    // 1. Let O be the result of calling toObject() passing the
    // |this| value as the argument.
    var O = Object(this);

    // 2. Let lenValue be the result of calling the Get() internal
    // method of O with the argument "length".
    // 3. Let len be toUint32(lenValue).
    var len = O.length >>> 0;

    // 4. If isCallable(callback) is false, throw a TypeError exception.
    // See: http://es5.github.com/#x9.11
    if (typeof callback !== "function") {
      throw new TypeError(callback + ' is not a function');
    }

    // 5. If thisArg was supplied, let T be thisArg; else let
    // T be undefined.
    if (arguments.length > 1) {
      T = thisArg;
    }

    // 6. Let k be 0
    k = 0;

    // 7. Repeat, while k < len
    while (k < len) {
      var kValue;

      // a. Let Pk be ToString(k).
      //    This is implicit for LHS operands of the in operator
      // b. Let kPresent be the result of calling the HasProperty
      //    internal method of O with argument Pk.
      //    This step can be combined with c
      // c. If kPresent is true, then
      if (k in O) {
        // i. Let kValue be the result of calling the Get internal
        // method of O with argument Pk.
        kValue = O[k];

        // ii. Call the Call internal method of callback with T as
        // the this value and argument list containing kValue, k, and O.
        callback.call(T, kValue, k, O);
      }
      // d. Increase k by 1.
      k++;
    }
    // 8. return undefined
  };
}
if (!Array.prototype.indexOf) {
  Array.prototype.indexOf = function (searchElement, fromIndex) {

    var k;

    // 1. Let o be the result of calling ToObject passing
    //    the this value as the argument.
    if (this === null) {
      throw new TypeError('"this" is null or not defined');
    }

    var o = Object(this);

    // 2. Let lenValue be the result of calling the Get
    //    internal method of o with the argument "length".
    // 3. Let len be ToUint32(lenValue).
    var len = o.length >>> 0;

    // 4. If len is 0, return -1.
    if (len === 0) {
      return -1;
    }

    // 5. If argument fromIndex was passed let n be
    //    ToInteger(fromIndex); else let n be 0.
    var n = +fromIndex || 0;

    if (Math.abs(n) === Infinity) {
      n = 0;
    }

    // 6. If n >= len, return -1.
    if (n >= len) {
      return -1;
    }

    // 7. If n >= 0, then Let k be n.
    // 8. Else, n<0, Let k be len - abs(n).
    //    If k is less than 0, then let k be 0.
    k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);

    // 9. Repeat, while k < len
    while (k < len) {
      // a. Let Pk be ToString(k).
      //   This is implicit for LHS operands of the in operator
      // b. Let kPresent be the result of calling the
      //    HasProperty internal method of o with argument Pk.
      //   This step can be combined with c
      // c. If kPresent is true, then
      //    i.  Let elementK be the result of calling the Get
      //        internal method of o with the argument ToString(k).
      //   ii.  Let same be the result of applying the
      //        Strict Equality Comparison Algorithm to
      //        searchElement and elementK.
      //  iii.  If same is true, return k.
      if (k in o && o[k] === searchElement) {
        return k;
      }
      k++;
    }
    return -1;
  };
}

/**
 * AcquiaHttpHmac - Let's you sign a XMLHttpRequest or promised-based request object (e.g. jqXHR) by Acquia's
 * HTTP HMAC Spec. For more information, see: https://github.com/acquia/http-hmac-spec/tree/2.0
 */

var AcquiaHttpHmac = function () {
  /**
   * Constructor.
   *
   * @constructor
   * @param {string} realm
   *   The provider.
   * @param {string} public_key
   *   Public key.
   * @param {string} secret_key
   *   Secret key.
   * @param {string} version
   *   Authenticator version.
   * @param {string} default_content_type
   *   Default content type of all signings (other than specified during signing).
   */
  function AcquiaHttpHmac(_ref) {
    var realm = _ref.realm,
        public_key = _ref.public_key,
        secret_key = _ref.secret_key,
        _ref$version = _ref.version,
        version = _ref$version === undefined ? '2.0' : _ref$version,
        _ref$default_content_ = _ref.default_content_type,
        default_content_type = _ref$default_content_ === undefined ? 'application/json' : _ref$default_content_;

    _classCallCheck(this, AcquiaHttpHmac);

    if (!realm) {
      throw new Error('The "realm" must not be empty.');
    }
    if (!public_key) {
      throw new Error('The "public_key" must not be empty.');
    }
    if (!secret_key) {
      throw new Error('The "secret_key" must not be empty.');
    }
    var supported_versions = ['2.0'];
    if (supported_versions.indexOf(version) < 0) {
      throw new Error('The version must be "' + supported_versions.join('" or "') + '". Version "' + version + '" is not supported.');
    }

    var parsed_secret_key = CryptoJS.enc.Base64.parse(secret_key);
    this.config = { realm: realm, public_key: public_key, parsed_secret_key: parsed_secret_key, version: version, default_content_type: default_content_type };

    /**
     * Supported methods. Other HTTP methods through XMLHttpRequest are not supported by modern browsers due to insecurity.
     *
     * @type array
     */
    this.SUPPORTED_METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS', 'CUSTOM'];
  }

  /**
   * Check if the request is a XMLHttpRequest.
   *
   * @param {(XMLHttpRequest|Object)} request
   *   The request to be signed, which can be a XMLHttpRequest or a promise-based request Object (e.g. jqXHR).
   * @returns {boolean}
   *   TRUE if the request is a XMLHttpRequest; FALSE otherwise.
   */


  _createClass(AcquiaHttpHmac, [{
    key: 'sign',


    /**
     * Sign the request using provided parameters.
     *
     * @param {(XMLHttpRequest|Object)} request
     *   The request to be signed, which can be a XMLHttpRequest or a promise-based request Object (e.g. jqXHR).
     * @param {string} method
     *   Must be defined in the supported_methods.
     * @param {string} path
     *   End point's full URL path, including schema, port, query string, etc. It must already be URL encoded.
     * @param {object} signed_headers
     *   Signed headers.
     * @param {string} content_type
     *   Content type.
     * @param {string} body
     *   Body.
     * @returns {string}
     */
    value: function sign(_ref2) {
      var request = _ref2.request,
          method = _ref2.method,
          path = _ref2.path,
          _ref2$signed_headers = _ref2.signed_headers,
          signed_headers = _ref2$signed_headers === undefined ? {} : _ref2$signed_headers,
          _ref2$body = _ref2.body,
          body = _ref2$body === undefined ? '' : _ref2$body;

      // Validate input. First 3 parameters are mandatory.
      //if (!request || !AcquiaHttpHmac.isXMLHttpRequest(request) && !AcquiaHttpHmac.isPromiseRequest(request)) {
    //    throw new Error('The request is required, and must be a XMLHttpRequest or promise-based request Object (e.g. jqXHR).');
      //}
      if (this.SUPPORTED_METHODS.indexOf(method) < 0) {
        throw new Error('The method must be "' + this.SUPPORTED_METHODS.join('" or "') + '". "' + method + '" is not supported.');
      }
      if (!path) {
        throw new Error('The end point path must not be empty.');
      }

      /**
       * Convert an object of parameters to a string.
       *
       * @param {object} parameters
       *   Header parameters in key: value pair.
       * @param value_prefix
       *   The parameter value's prefix decoration.
       * @param value_suffix
       *   The parameter value's suffix decoration.
       * @param glue
       *   When join(), use this string as the glue.
       * @param encode
       *   When true, encode the parameter's value; otherwise don't encode.
       * @returns {string}
       */
      var parametersToString = function parametersToString(parameters) {
        var value_prefix = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '=';
        var value_suffix = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
        var glue = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '&';
        var encode = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : true;

        var parameter_keys = Object.keys(parameters),
            processed_parameter_keys = [],
            processed_parameters = {},
            result_string_array = [];

        // Process the headers.
        // 1) Process the parameter keys into lowercase, and
        // 2) Process values to URI encoded if applicable.
        parameter_keys.forEach(function (parameter_key) {
          if (!parameters.hasOwnProperty(parameter_key)) {
            return;
          }
          var processed_parameter_key = parameter_key.toLowerCase();
          processed_parameter_keys.push(processed_parameter_key);
          processed_parameters[processed_parameter_key] = encode ? encodeURIComponent(parameters[parameter_key]) : parameters[parameter_key];
        });

        // Process into result string.
        processed_parameter_keys.sort().forEach(function (processed_parameter_key) {
          if (!processed_parameters.hasOwnProperty(processed_parameter_key)) {
            return;
          }
          result_string_array.push('' + processed_parameter_key + value_prefix + processed_parameters[processed_parameter_key] + value_suffix);
        });
        return result_string_array.join(glue);
      };

      /**
       * Generate a UUID nonce.
       *
       * @returns {string}
       */
      var generateNonce = function generateNonce() {
        var d = Date.now();
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
          var r = (d + Math.random() * 16) % 16 | 0;
          d = Math.floor(d / 16);
          return (c == 'x' ? r : r & 0x7 | 0x8).toString(16);
        });
      };

      /**
       * Determine if this request sends body content (or skips silently).
       *
       * Note: modern browsers always skip body at send(), when the request method is "GET" or "HEAD".
       *
       * @param body
       *   Body content.
       * @param method
       *   The request's method.
       * @returns {boolean}
       */
      var willSendBody = function willSendBody(body, method) {
        var bodyless_request_types = ['GET', 'HEAD'];
        return body.length !== 0 && bodyless_request_types.indexOf(method) < 0;
      };

      // Compute the authorization headers.
      var nonce = generateNonce(),
          parser = AcquiaHttpHmac.parseUri(path),
          authorization_parameters = {
              id: this.config.public_key,
              nonce: request.id,
              realm: this.config.realm,
              version: this.config.version
          },
          x_authorization_timestamp = Math.floor(Date.now() / 1000).toString(),
          x_authorization_content_sha256 = willSendBody(body, method) ? CryptoJS.SHA256(body).toString(CryptoJS.enc.Base64) : '',
          signature_base_string_content_suffix = willSendBody(body, method) ? '\n' + x_authorization_content_sha256 : '',
          site_port = parser.port ? ':' + parser.port : '',
          site_name_and_port = '' + parser.hostname + site_port,
          url_query_string = parser.search,
          signed_headers_string = parametersToString(signed_headers, ':', '', '\n', false),
          signature_base_signed_headers_string = signed_headers_string === '' ? '' : signed_headers_string + '\n',
          signature_base_string = method + '\n' + site_name_and_port + '\n' + (parser.pathname || '/') + '\n' + url_query_string + '\n' + parametersToString(authorization_parameters) + '\n' + signature_base_signed_headers_string + x_authorization_timestamp + signature_base_string_content_suffix,
          authorization_string = parametersToString(authorization_parameters, '="', '"', ','),
          authorization_signed_headers_string = encodeURI(Object.keys(signed_headers).join('|||||').toLowerCase().split('|||||').sort().join(';')),
          signature = encodeURI(CryptoJS.HmacSHA256(signature_base_string, this.config.parsed_secret_key).toString(CryptoJS.enc.Base64)),
          authorization = 'acquia-http-hmac ' + authorization_string + ',headers="' + authorization_signed_headers_string + '",signature="' + signature + '"';

        // Set the authorizations headers.
        request.acquiaHttpHmac = {};
        request.acquiaHttpHmac.timestamp = x_authorization_timestamp;
        request.acquiaHttpHmac.nonce = nonce;

        postman.setEnvironmentVariable('acqHmacTimestamp',x_authorization_timestamp);
        postman.setEnvironmentVariable('acqHmacHeader', authorization);
        postman.setEnvironmentVariable('acqHmacContentSha',x_authorization_content_sha256);

        void 0;
        void 0;
        void 0;
        void 0;
        void 0;
    }
  }, {
    key: 'hasValidResponse',


    /**
     * Check if the request has a valid response.
     *
     * @param {XMLHttpRequest|Object} request
     *   The request to be validated.
     * @returns {boolean}
     *   TRUE if the request is valid; FALSE otherwise.
     */
    value: function hasValidResponse(request) {
      var signature_base_string = request.acquiaHttpHmac.nonce + '\n' + request.acquiaHttpHmac.timestamp + '\n' + request.responseText,
          signature = CryptoJS.HmacSHA256(signature_base_string, this.config.parsed_secret_key).toString(CryptoJS.enc.Base64),
          server_signature = request.getResponseHeader('X-Server-Authorization-HMAC-SHA256');

      void 0;
      void 0;
      void 0;

      return signature === server_signature;
    }
  }], [{
    key: 'isXMLHttpRequest',
    value: function isXMLHttpRequest(request) {
      if (request instanceof XMLHttpRequest || request.onreadystatechange) {
        return true;
      }
      return false;
    }

    /**
     * Check if the request is a promise-based request Object (e.g. jqXHR).
     *
     * @param {(XMLHttpRequest|Object)} request
     *   The request to be signed, which can be a XMLHttpRequest or a promise-based request Object (e.g. jqXHR).
     * @returns {boolean}
     *   TRUE if the request is a promise-based request Object (e.g. jqXHR); FALSE otherwise.
     */

  }, {
    key: 'isPromiseRequest',
    value: function isPromiseRequest(request) {
      return request.hasOwnProperty('setRequestHeader') && request.hasOwnProperty('getResponseHeader') && request.hasOwnProperty('promise');
    }

    /**
     * Implementation of Steven Levithan uri parser.
     *
     * @param  {String}   str The uri to parse
     * @param  {Boolean}  strictMode strict mode flag
     * @return {Object}   parsed representation of a uri
     */

  }, {
    key: 'parseUri',
    value: function parseUri(str) {
      var strictMode = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

      var o = {
        key: ["source", "protocol", "host", "userInfo", "user", "password", "hostname", "port", "relative", "pathname", "directory", "file", "search", "hash"],
        q: {
          name: "queryKey",
          parser: /(?:^|&)([^&=]*)=?([^&]*)/g
        },
        parser: {
          strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
          loose: /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
        }
      },
          m = o.parser[strictMode ? "strict" : "loose"].exec(str),
          uri = {},
          i = 14;

      while (i--) {
        uri[o.key[i]] = m[i] || "";
      }uri[o.q.name] = {};
      uri[o.key[12]].replace(o.q.parser, function ($0, $1, $2) {
        if ($1) uri[o.q.name][$1] = $2;
      });

      return uri;
    }
  }]);

  return AcquiaHttpHmac;
}();

function switchOutEnvironmentVariables(anString)
{
    var placeHolder = "";
    var place = "";
    var switchedOut = "";
    switchedOut = anString;

    //enforce type string
    //anString = anString.toString();
    //no, politely refuse to switch out anything that is not a string
    //TODO loop over objects and replace anything found at any level
    if(typeof anString != "string")
    {
        //bail without substituting
        return anString;
    }

    //seek anything between braces but don't be greedy
    var seekVariables = anString.match(/{{.+?}}/g);
    if(seekVariables)
    {
        for (var i=0;i<seekVariables.length;i++)
        {
            placeHolder = seekVariables[i].substr(2,seekVariables[i].length-4);
            place = postman.getEnvironmentVariable(placeHolder);
            switchedOut = switchedOut.replace("{{"+placeHolder+"}}",place);
        }
    }

    return switchedOut;
}

var method = request.method.toUpperCase();
var path = switchOutEnvironmentVariables(request.url);
var signed_headers = {};
var body = request.data;
var sign_parameters;
if (body && typeof body === "string")
{
    body = switchOutEnvironmentVariables(body);
    sign_parameters = {request, method, path, signed_headers, body};
}
else
{
    sign_parameters= {request, method, path, signed_headers};
}
var hmac_config = {
        realm: hmacRealm,
        public_key: publicKey,
        secret_key: secretKey
    };

const HMAC = new AcquiaHttpHmac(hmac_config);
HMAC.sign(sign_parameters);
