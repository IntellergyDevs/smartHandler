const AWS = require('aws-sdk');
const dynamodb =new AWS.DynamoDB.DocumentClient()


async function deleteCenter(event, context) {
    try {
      const { id } = event.pathParameters;
  
      await dynamodb.delete({
        TableName: process.env.CENTERS_TABLE_NAME,
        Key: { id },
      }).promise();
  
      return {
        statusCode: 200,
        body: JSON.stringify({ message: "Center deleted successfully" }),
      };
    } catch (error) {
      console.error("Error deleting center: ", error);
      return {
        statusCode: 500,
        body: JSON.stringify({ message: "Failed to delete center" }),
      };
    }
  }
  
  
  module.exports.handler =  deleteCenter;