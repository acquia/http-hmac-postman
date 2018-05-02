/*
 * HTTP-HMAC-POSTMAN
 * VERSION: 1.1.5
 *
 * To use this script, paste it into the Postman pre-script editor
 * *AND* add these headers to the request
 *   Authorization:{{acqHmacHeader}}
 *   X-Authorization-Timestamp:{{acqHmacTimestamp}}
 *   X-Authorization-Content-SHA256:{{acqHmacContentSha}}
 *
 *   This code sets the Postman environment variables:
 *     {{acqHmacHeader}}
 *     {{acqHmacTimestamp}}
 *     {{acqHmacContentSha}}
 *
 *   This code expects these Postman environment variables to be set:
 *     {{hmacKey}} defaults to ''
 *     {{hmacSecret}} defaults to ''
 *     {{secretIsBase64encoded}} defaults to true
 *
 *   This code replaces Postman variables in url and body text before HMAC encoding
 *
 *   Note: Only HMAC version 2.0 is supported
 *
 *   Notes for using this script to connect to Acquia Commerce Connector Service
 *      1. Create Postman environment Variable 'secretIsBase64encoded' set it to 'false'
 *      2. Do not base64 encode the HMAC secret
 *
 *   Notes for using this script to connect to Acquia Lift
 *      1. Use a base64 encoded secret
 *      2. If you have created Postman environment Variable 'secretIsBase64encoded'set it to 'true'
 *         but if you have not created that variable it can be omitted (because the default here is true)
 *
 */

var publicKey = postman.getEnvironmentVariable('env_pubkey') || '';
var secretKey = postman.getEnvironmentVariable('env_secretkey') || '';
var hmacRealm = postman.getEnvironmentVariable('env_realm') || '';

// Decide what to do with the secret.
var hasAlreadyEncodedSecret = postman.getEnvironmentVariable('secretIsBase64encoded') || true;
if (hasAlreadyEncodedSecret && hasAlreadyEncodedSecret !== "false")
{
    // Do nothing here.
}
else
{
    // Encode the secret.
    // Base64 encoding the secret can be unnecessary but that is a discussion for another day.
    wordArray = CryptoJS.enc.Utf8.parse(secretKey);
    secretKey = CryptoJS.enc.Base64.stringify(wordArray);
}


//Acquia HMAC LIB https://github.com/acquia/http-hmac-javascript (modified)
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * AcquiaHttpHmac - Let's you sign a request object (e.g. jqXHR) by Acquia's
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
   */
  function AcquiaHttpHmac(_ref) {
    var realm = _ref.realm,
        public_key = _ref.public_key,
        secret_key = _ref.secret_key,
        version = '2.0',
        default_content_type = 'application/json';

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

    this.config = {
        realm: realm,
        public_key: public_key,
        parsed_secret_key: CryptoJS.enc.Base64.parse(secret_key),
        version: version,
        default_content_type: default_content_type
    };

    /**
     * Supported methods. Other HTTP methods through XMLHttpRequest are not supported by modern browsers due to insecurity.
     *
     * @type array
     */
    this.SUPPORTED_METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS', 'CUSTOM'];
  }

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
          _ref2$content_type = _ref2.content_type,
          content_type = _ref2$content_type === undefined ? this.config.default_content_type : _ref2$content_type,
          _ref2$body = _ref2.body,
          body = _ref2$body === undefined ? '' : _ref2$body;

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
          signature_base_string_content_suffix = willSendBody(body, method) ? '\n' + content_type + '\n' + x_authorization_content_sha256 : '',
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

        postman.setEnvironmentVariable('acqHmacTimestamp',x_authorization_timestamp);
        postman.setEnvironmentVariable('acqHmacHeader', authorization);
        postman.setEnvironmentVariable('acqHmacContentSha',x_authorization_content_sha256);

    }
  }],
  [{
    /**
     * Implementation of Steven Levithan uri parser.
     *
     * @param  {String}   str The uri to parse
     * @param  {Boolean}  strictMode strict mode flag
     * @return {Object}   parsed representation of a uri
     */

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
//END Acquia HMAC LIB https://github.com/acquia/http-hmac-javascript (modified)

/**
 * Utility function to switch out any Postman environment variables in the URL or body
 * of the request. Necessary because Postman has not substituted them yet.
 *
 * @param String   anString The string to parse and replace any {{envVars}} with values
 * @return string  The string with all {{envVars}} replaced
 */
function switchOutEnvironmentVariables(anString)
{
    var placeHolder = "";
    var place = "";
    var switchedOut = "";
    switchedOut = anString;

    // Politely refuse to switch out anything that is not a string.
    if(typeof anString != "string")
    {
        // Bail without substituting.
        return anString;
    }

    // Seek anything between braces but don't be greedy.
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
var content_type = request.headers['content-type'];

if (body && typeof body === "string")
{
    body = switchOutEnvironmentVariables(body);
}
else
{
    body = undefined;
}

var sign_parameters = {request, method, path, signed_headers, content_type, body};

var hmac_config = {
        realm: hmacRealm,
        public_key: publicKey,
        secret_key: secretKey
    };

const HMAC = new AcquiaHttpHmac(hmac_config);
HMAC.sign(sign_parameters);
