const { getDataByType } = require('./services/awsDynamoDB');
const { getReturnObject } = require('./tools/tools'); 

/**
 * Get all logs by type
 * @param {AWSLambda.APIGatewayEvent} event The AWS API Gateway Event
 * @returns {AWSLambda.APIGatewayProxyResult} Response to API Gateway
 */
const handler = async (event) => {
    try {
      const query = event.queryStringParameters;
      if (query === null || query.type === undefined) {
        return getReturnObject(false, 'You must send the type.');
      } 
      const { Items } = await getDataByType(query.type);    
      return getReturnObject(true, Items);
    } catch (error) {
      return getReturnObject(false, error.message);
    }
};

module.exports = {handler};