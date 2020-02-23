'use strict';
const { getDataByOrigin } = require('./services/awsDynamoDB');
const { getReturnObject } = require('./tools/tools'); 

/**
 * Returns all log events with a given source.
 * @param {AWSLambda.APIGatewayEvent} event The AWS API Gateway Event
 * @returns {Promise<AWSLambda.APIGatewayProxyResult>} Response to API Gateway
 */
const handler = async (event) => {
    try {
      const query = event.queryStringParameters;
      if (query === null || query.origin === undefined) {
        return getReturnObject(false, 'You must send the origin.');
      }
      console.debug(await getDataByOrigin(query.origin));
      const { Items } = await getDataByOrigin(query.origin);  
      return getReturnObject(true, Items);
    } catch (error) {    
      return getReturnObject(false, error.message);
    }
};

module.exports = {handler};