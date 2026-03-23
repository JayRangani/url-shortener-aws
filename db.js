const AWS = require("aws-sdk");

AWS.config.update({
  region: "ap-south-1"
});

const dynamodb = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = "UrlShortener";

// Save URL
async function saveUrl(shortId, longUrl) {
  const params = {
    TableName: TABLE_NAME,
    Item: {
      short_id: shortId,
      long_url: longUrl,
      clicks: 0,
      created_at: new Date().toISOString()
    }
  };

  await dynamodb.put(params).promise();
}

// Get URL
async function getUrl(shortId) {
  const params = {
    TableName: TABLE_NAME,
    Key: { short_id: shortId }
  };

  const result = await dynamodb.get(params).promise();
  return result.Item;
}

// Increment clicks
async function incrementClicks(shortId) {
  const params = {
    TableName: TABLE_NAME,
    Key: { short_id: shortId },
    UpdateExpression: "SET clicks = clicks + :inc",
    ExpressionAttributeValues: {
      ":inc": 1
    }
  };

  await dynamodb.update(params).promise();
}

module.exports = { saveUrl, getUrl, incrementClicks };