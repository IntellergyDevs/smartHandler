const AWS = require('aws-sdk');
const dynamodb =new AWS.DynamoDB.DocumentClient()


async function getCenter(event, context) {
    try {
      const { id } = event.pathParameters;
  
      const result = await dynamodb.get({
        TableName: process.env.CENTERS_TABLE_NAME,
        Key: { id },
      }).promise();
  
      if (result.Item) {
        return {
          statusCode: 200,
          body: JSON.stringify(result.Item),
        };
      } else {
        return {
          statusCode: 404,
          body: JSON.stringify({ message: "Center not found" }),
        };
      }
    } catch (error) {
      console.error("Error getting center: ", error);
      return {
        statusCode: 500,
        body: JSON.stringify({ message: "Failed to get center" }),
      };
    }
  }

  module.exports.handler = getCenter