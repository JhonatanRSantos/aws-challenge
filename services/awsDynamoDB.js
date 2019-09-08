const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();
const table = 'aws-challenge';

async function saveData (record) {
    const { body, attributes: { SentTimestamp } } = record;
    const content = { id: SentTimestamp, ...JSON.parse(body)};    
    const parameters = { TableName: table, Item: content };
    try {
        await docClient.put(parameters).promise();
    } catch (error) {
        console.error(`Can not save data: ${JSON.stringify(error, null, 2)}`);
    }
};
module.exports = { saveData };