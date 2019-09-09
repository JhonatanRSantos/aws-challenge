'use strict';
const AWS = require('aws-sdk');
const sqs = new AWS.SQS({ apiVersion: '2012-11-05' });
const { SQS: {QueueUrl} } =require('../config/config.json');

/**
 * Send a message to AWS SQS Queue.
 * @param {String} MessageBody Message to be sent.
 */
async function sendMessage (MessageBody) { 
    try {
        const parameters = { MessageBody, QueueUrl };
        await sqs.sendMessage(parameters).promise();        
    } catch (error) {
        console.error(`Can not send messagge to queue: ${error}`);
    }
}
/**
 * Delete a messagem from AWS SQS Queue
 * @param {String} ReceiptHandle 
 */
async function deleteMessage (ReceiptHandle) {
    const parameters = { QueueUrl, ReceiptHandle };
    try {
        await sqs.deleteMessage(parameters).promise();
    } catch (error) {
        console.log(`Can not delete message: ${error}`);
    }
}
module.exports = { sendMessage, deleteMessage };