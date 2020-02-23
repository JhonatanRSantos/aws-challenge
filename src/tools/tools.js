/**
 * Generates a request response.
 * @param {Boolean} type True to success and False to failure.
 * @param {Object} data Will be added to answer body.
 */
const getReturnObject = function(type, data=undefined) {
    if (type) {
      if (!data) {
        return { statusCode : 200 , body: JSON.stringify({ status: true }) };
      }
      return { statusCode : 200 , body: JSON.stringify({ status: true, body: data }) };
    }
    return { statusCode : 500, body : JSON.stringify({ status : false, message : data }) }; 
}

module.exports = {getReturnObject};