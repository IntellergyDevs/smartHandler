const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

async function updateCenter(event, context) {
    try {
        const { id } = event.pathParameters;
        const { name, location, noTickets_served, revenueTotal } = JSON.parse(event.body);
        
        let updateExpression = "set";
        const ExpressionAttributeValues = {};
        const ExpressionAttributeNames = {};
        let firstExpressionAdded = false;
        
        if (name !== undefined) {
            updateExpression += " #name = :n";
            ExpressionAttributeValues[":n"] = name;
            ExpressionAttributeNames["#name"] = "name";
            firstExpressionAdded = true;
        }
        
        if (location !== undefined) {
            if (firstExpressionAdded) updateExpression += ",";
            updateExpression += " addressLocation = :l";
            ExpressionAttributeValues[":l"] = location;
            firstExpressionAdded = true;
        }
        
        if (noTickets_served !== undefined) {
            if (firstExpressionAdded) updateExpression += ",";
            updateExpression += " noTickets_served = :t";
            ExpressionAttributeValues[":t"] = noTickets_served;
            firstExpressionAdded = true;
        }
        
        if (revenueTotal !== undefined) {
            if (firstExpressionAdded) updateExpression += ",";
            updateExpression += " revenueTotal = :r";
            ExpressionAttributeValues[":r"] = revenueTotal;
        }

        await dynamodb.update({
            TableName: process.env.CENTERS_TABLE_NAME,
            Key: { id },
            UpdateExpression: updateExpression,
            ExpressionAttributeValues: ExpressionAttributeValues,
            ExpressionAttributeNames: ExpressionAttributeNames,
            ReturnValues: "UPDATED_NEW",
        }).promise();

        return {
            statusCode: 200,
            body: JSON.stringify({ message: "Center updated successfully" }),
        };
    } catch (error) {
        console.error("Error updating center: ", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Failed to update center" }),
        };
    }
}

module.exports.handler = updateCenter;
