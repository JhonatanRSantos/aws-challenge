const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();
const TableName = process.env.table_name;

/**
 * Save an object to the database.
 * @param {AWSLambda.SQSRecord} record Object to be saved.
 * @returns {Promise<void>}
 */
async function saveData (record) {
    const { body, attributes: { SentTimestamp } } = record;
    const content = { timestamps: SentTimestamp, ...JSON.parse(body)};    
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
 * @returns {Promise<AWS.DynamoDB.DocumentClient.ScanOutput, AWS.AWSError>} Response
 */
async function getDataByOrigin(origin) {    
    try {
        return await docClient.scan(queryParmeters(origin, "origin")).promise();
    } catch (error) {
        console.log(`Can not get data from database: ${error}`);
    }
}

/**
 * Generate search parameters with source.
 * @param {String} toSearch 
 * @returns {Object} Query parms
 */
function queryParmeters(toSearch, fildName) {
    if (type === "origin") {
        return {
            TableName,
            FilterExpression: "#origin = :origin",
            ExpressionAttributeNames:{
                "#origin": "origin"
            },
            ExpressionAttributeValues: {
                ":origin": `${toSearch}`
            }
        };
    } else if (type === "type") {
        return {
            TableName,
            FilterExpression: "#type = :type",
            ExpressionAttributeNames: {
                "#type": "type",
            },
            ExpressionAttributeValues: { ":type": `${toSearch}` }
        
        };
    }
    
}

/**
 * Gets one or more objects in the database.
 * @param {String} type Type of object.
 * @returns {Promise<AWS.DynamoDB.DocumentClient.ScanInput, AWS.AWSError>} Response
 */
async function getDataByType(type) {      
    try {
        return await docClient.scan(queryParmeters(type, "type")).promise();
    } catch (error) {
        console.log(`Can not get data from database: ${error.message}`);
    }
}

module.exports = { saveData, getDataByOrigin, getDataByType };