'use strict';
const { sendMessage, deleteMessage } = require('./services/awsSQS');
const { saveData, getDataByOrigin, getDataByType } = require('./services/awsDynamoDB');

/**
 * Write the object in an Amazon queue.
 * @param {Object} event 
 */
const createLogEntry = async (event) => {
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

/**
 * Lambda function to call when a new object is inserted into the queue.
 * @param {Object} event 
 */
const saveLog = async (event) => {
  try {
    await Promise.all(event.Records.map(async (record) => {
      const { receiptHandle } = record;
      await saveData(record);
      await deleteMessage(receiptHandle);    
    }));    
  } catch (error) {
    console.log(`Can not save log: ${error}`);
  }
};

/**
 * Returns all log events with a given source.
 * @param {Object} event 
 */
const getLogsByOrigin = async (event) => {
  try {
    const query = event.queryStringParameters;
    if (query === null || query.origin === undefined) {
      return getReturnObject(false, 'You must send the origin.');
    }    
    const { Items } = await getDataByOrigin(query.origin);  
    return getReturnObject(true, Items);
  } catch (error) {    
    return getReturnObject(false, error.message);
  }
};

const getLogsByType = async (event) => {
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
}
module.exports = { createLogEntry, saveLog, getLogsByOrigin, getLogsByType };