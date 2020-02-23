'use strict';
const { sendMessage } = require('./services/awsSQS');
const { getReturnObject } = require('./tools/tools'); 

/**
 * Write the object in an Amazon queue.
 * @param {AWSLambda.APIGatewayEvent} event The AWS API Gateway Event
 * @returns {AWSLambda.APIGatewayProxyResult} Response to API Gateway
 */
const handler = async (event) => {
    const logTypes = ['log', 'warn', 'error', 'custom'];
    try {
        if (event.body === null) {
        return getReturnObject(false, 'Request body cannot be empty.');
        }
        const { origin, type, message } = JSON.parse(event.body);
        if (origin === undefined || type === undefined || message === undefined
            || origin === '' || type === '' || message === '' || !logTypes.includes(type)) {
        return getReturnObject(false, 'You must send the origin, type, and message in the body of the request.');
        }
        await sendMessage(event.body);
        return getReturnObject(true);    
    } catch (error) {    
        return getReturnObject(false, error.message);
    }
};

module.exports = {handler};