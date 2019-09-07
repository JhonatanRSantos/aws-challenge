'use strict';
const AWS = require('aws-sdk');

async function awsSQSSendMessage() { 
    console.log("awsSQSSendMessage");
    try {
      const sqs = new AWS.SQS({ apiVersion: '2012-11-05' });
      const accountId = '243893291204';
      const queueName = 'aws-challenge';
      const QueueUrl =  `https://sqs.us-east-1.amazonaws.com/${accountId}/${queueName}`;
  
      const params = {
        MessageBody: JSON.stringify({
          order_id: 1234,
          date: (new Date()).toISOString()
        }),
        QueueUrl
      };
  
      return new Promise((resolve, reject)=> {
        sqs.sendMessage(params, (err, data) => {
          if (err) {
            console.log("Error", err);
            reject();
          } else {
            console.log("Successfully added message", data.MessageId);
            resolve();
          }
        });
      });
    } catch (error) {
      console.error(`Erro inesperado...\n${error}`);
    }
}
module.exports = { 
    sendMessage: awsSQSSendMessage
};