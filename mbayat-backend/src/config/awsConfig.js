const AWS = require("aws-sdk");

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.SECERT_KEY,
  region: process.env.REGION,
});

const s3 = new AWS.S3();
module.exports = s3;
