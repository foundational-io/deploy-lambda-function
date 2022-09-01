const core = require('@actions/core');
const AWS = require('aws-sdk');

try {
  const functionName = core.getInput('function-name');
  const AWS_SECRET_KEY = core.getInput('AWS_SECRET_KEY');
  const AWS_SECRET_ID = core.getInput('AWS_SECRET_ID');
  const AWS_REGION = core.getInput('AWS_REGION');
  const IMAGE_URI = core.getInput('IMAGE_URI');

  console.log(`Deploying ${functionName}`);

  // var zipBuffer = fs.readFileSync(`./${packageName}`);
  core.debug('ZIP file put into memory buffer.');

  const lambda = new AWS.Lambda({
      apiVersion: '2015-03-31',
      region: AWS_REGION,
      secretAccessKey: AWS_SECRET_KEY,
      accessKeyId: AWS_SECRET_ID,
      maxRetries: 3,
      sslEnabled: true,
      logger: console,
  });

  const params = {
    FunctionName: functionName,
    Publish: true,
    ImageUri: IMAGE_URI,
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
