'use strict';
const AWS = require('aws-sdk');
const sqs = new AWS.SQS({ apiVersion: '2012-11-05' });
const accountId = '243893291204';
const queueName = 'aws-challenge';
const QueueUrl =  `https://sqs.us-east-1.amazonaws.com/${accountId}/${queueName}`;

async function awsSQSSendMessage(MessageBody) { 
    try {
        const params = { MessageBody, QueueUrl };
        return new Promise((resolve, reject)=> {
            sqs.sendMessage(params, (error, data) => {
                if (error) {
                    console.error(`Error:\n${err}`);
                    reject();
                } else {
                    console.log(`Successfully added message: ${data.MessageId}`);
                    resolve();
                }
            });
        });
    } catch (error) {
        console.error(`Internal error\n${error}`);
    }
}
module.exports = { 
    sendMessage: awsSQSSendMessage
};