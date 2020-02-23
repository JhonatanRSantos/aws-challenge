'use strict';
const { deleteMessage } = require('./services/awsSQS');
const { saveData } = require('./services/awsDynamoDB');

/**
 * Lambda function to call when a new object is inserted into the queue.
 * @param {AWSLambda.SQSEvent} event The SQS Event
 * @returns {Promise<void>}
 */
const handler = async (event) => {
    try {
      await Promise.all(event.Records.map(async (record) => {
        const { receiptHandle } = record;
        // Save current message into DynamoDB
        await saveData(record);
        // Delete current message from queue
        await deleteMessage(receiptHandle);    
      }));    
    } catch (error) {
      console.log(`Can not save log: ${error}`);
    }
};

module.exports = {handler};