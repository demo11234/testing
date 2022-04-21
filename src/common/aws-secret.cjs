let AWS = require('aws-sdk');
let fs = require('fs');

let secretName = '';
const client = new AWS.SecretsManager({ region: 'us-east-1' });
if (process.env.NODE_ENV == 'uat') {
  secretName = 'secret_arn'; // use string
} else if (process.env.NODE_ENV == 'prod') {
  secretName = 'secret_arn'; // use string
} else {
  secretName =
    'arn:aws:secretsmanager:us-east-1:294810812352:secret:dev/jungle-16b4AP'; // use string
}

client.getSecretValue({ SecretId: secretName }, function (err, data) {
  if (err) {
    console.log('AWS creds not accessed ', err);
    process.exit();
  } else {
    const credData = JSON.parse(data.SecretString || '{}');
    let envStr = '';
    for (const key in credData) {
      envStr += key + '=' + credData[key] + '\n';
    }
    fs.writeFileSync('./.env.stage.dev', envStr);
    process.exit();
  }
});
