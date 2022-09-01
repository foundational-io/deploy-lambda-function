const core = require('@actions/core');
const AWS = require('aws-sdk');

try {
  const functionName = core.getInput('function-name');
  const awsSecretKy = core.getInput('aws_secret_key');
  const awsAccessKeyId = core.getInput('aws_access_key_id');
  const awsRegion = core.getInput('aws_region');
  const imageUri = core.getInput('image_uri');

  console.log(`Deploying ${functionName}`);

  // var zipBuffer = fs.readFileSync(`./${packageName}`);
  core.debug('ZIP file put into memory buffer.');

  const lambda = new AWS.Lambda({
      apiVersion: '2015-03-31',
      region: awsRegion,
      secretAccessKey: awsSecretKy,
      accessKeyId: awsAccessKeyId,
      maxRetries: 3,
      sslEnabled: true,
      logger: console,
  });

  const params = {
    FunctionName: functionName,
    Publish: true,
    ImageUri: imageUri,
  };

  lambda.updateFunctionCode(params, err => {
      if (err) {
          console.error(err);
          core.setFailed(err)
      }
  });

} catch (error) {
  core.setFailed(error.message);
}
