const AWS = require('aws-sdk');
const dynamodb =new AWS.DynamoDB.DocumentClient()

const { v4: uuidv4 } = require('uuid');

async function createCenter(event, context) {
  try {
    const { name, location, noTickets_served, revenueTotal } = JSON.parse(event.body);
    
    // Basic validation to check if essential fields are present
    if (!name || !location) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Missing mandatory fields: name or location" }),
      };
    }

    // Check if a center with the same name already exists
    const existingCenter = await dynamodb.scan({
      TableName: process.env.CENTERS_TABLE_NAME,
      FilterExpression: "#name = :name",
      ExpressionAttributeNames: {
        "#name": "name",
      },
      ExpressionAttributeValues: {
        ":name": name,
      },
    }).promise();

    if (existingCenter.Items.length > 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "A center with this name already exists" }),
      };
    }

    // Generate a unique ID for each center
    const id = uuidv4();

    const center = {
      id,
      name,
      location,
      noTickets_served: noTickets_served || 0, // Default to 0 if not provided
      revenueTotal: revenueTotal || 0, // Default to 0 if not provided
    };

    await dynamodb.put({
      TableName: process.env.CENTERS_TABLE_NAME,
      Item: center,
    }).promise();

    return {
      statusCode: 201,
      body: JSON.stringify({ message: "Center is added", data: center }),
    };
  } catch (error) {
    console.error("Error adding center: ", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Failed to add center" }),
    };
  }
}





module.exports.handler = createCenter;