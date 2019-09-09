const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();
const { DynamoDB: {TableName} } = require('../config/config.json');

/**
 * Save an object to the database.
 * @param {Object} record Object to be saved.
 */
async function saveData (record) {
    const { body, attributes: { SentTimestamp } } = record;
    const content = { timestamp: SentTimestamp, ...JSON.parse(body)};    
    const parameters = { TableName, Item: content };
    try {
        await docClient.put(parameters).promise();
    } catch (error) {
        console.error(`Can not save data: ${JSON.stringify(error, null, 2)}`);
    }
};

/**
 * Gets one or more objects in the database.
 * @param {String} origin Object origin.
 */
async function getData(origin) {    
    try {
        return await docClient.query(queryParmeters(origin)).promise();
    } catch (error) {
        console.log(`Can not get data from database: ${error}`);
    }
}

/**
 * Generate search parameters with source.
 * @param {String} origin 
 */
function queryParmeters(origin) {
    return {
        TableName,
        KeyConditionExpression: "#origin = :origin",
        ExpressionAttributeNames:{
            "#origin": "origin"
        },
        ExpressionAttributeValues: {
            ":origin": `${origin}`
        }
    };
}
module.exports = { saveData, getData };