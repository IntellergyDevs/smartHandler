const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

// Existing imports and functions...

// Handler for retrieving all centers
async function getAllCenters(event, context) {
    try {
        const result = await dynamodb.scan({
            TableName: process.env.CENTERS_TABLE_NAME,
        }).promise();

        return {
            statusCode: 200,
            body: JSON.stringify({ data: result.Items }),
        };
    } catch (error) {
        console.error("Error retrieving all centers: ", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Failed to retrieve centers" }),
        };
    }
}

module.exports.handler = getAllCenters;