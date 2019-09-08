'use strict';
const logTypes = ['log', 'warn', 'error', 'custom'];
const { sendMessage, deleteMessage } = require('./services/awsSQS');
const { saveData, getData } = require('./services/awsDynamoDB');

const createLogEntry = async (event) => {
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

const getReturnObject = function(type, data=undefined) {
  if (type) {
    if (!data) {
      return { statusCode : 200 , body: JSON.stringify({ status: true }) };
    }
    return { statusCode : 200 , body: JSON.stringify({ status: true, body: data }) };
  }
  return { statusCode : 500, body : JSON.stringify({ status : false, message : data }) };
  //return type
  //    ? { statusCode : 200 , body: JSON.stringify({ status: true }) } 
  //    : { statusCode : 500, body : JSON.stringify({ status : false, message : data }) };
}

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

const getLogsByType = async (event) => {
  try {
    const query = event.queryStringParameters;
    if (query === null || query.origin === undefined) {
      return getReturnObject(false, 'You must send the origin.');
    }    
    const { Items } = await getData(query.origin);  
    return getReturnObject(true, Items);
  } catch (error) {    
    return getReturnObject(false, error.message);
  }
};

module.exports = { createLogEntry, saveLog, getLogsByType };