'use strict';
const logTypes = ['log', 'warn', 'error', 'custom'];
const { sendMessage, deleteMessage } = require('./services/awsSQS');
const { saveData } = require('./services/awsDynamoDB');

module.exports.createLogEntry = async event => {
  try {
    if (event.body === null) {
      return getReturnObject(false);
    }
    const { origin, type, message } = JSON.parse(event.body);
    if (origin === undefined || type === undefined || message === undefined
        || origin === '' || type === '' || message === '' || !logTypes.includes(type)) {
      return getReturnObject(false);
    }
    await sendMessage(event.body);
    return getReturnObject(true);
  } catch (error) {
    return getReturnObject(false);
  }
};

function getReturnObject(type) {
  return type
      ? { statusCode : 200 , body: JSON.stringify({ status: true }) } 
      : { statusCode : 500, body : JSON.stringify({ status : false, message : 'error' }) };
}

module.exports.saveLog = async event => {
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