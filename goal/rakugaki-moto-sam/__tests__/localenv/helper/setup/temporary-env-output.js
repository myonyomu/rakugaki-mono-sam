const {
  ListUserPoolsCommand,
  ListUserPoolClientsCommand,
  DescribeUserPoolCommand,
} = require("@aws-sdk/client-cognito-identity-provider");
const LocalCognitoIdpClientProvider = require("../../utils/LocalCognitoIdpClientProvider");

const fs = require("fs").promises;
const path = require("path")

const dummyUserPoolInformation = require("../../resources/dummy-userpool-information.json");

// Find pool by id => Find pool client by pool id => Initiate auth with userpool client id
const main = async () => {
  const client = LocalCognitoIdpClientProvider.generateProvider();

  const listUserPoolCommand = new ListUserPoolsCommand({
    MaxResults: 10,
  });
  const userPoolRes = await client.send(listUserPoolCommand);
  const targetPool = userPoolRes.UserPools.find(
    (pool) => pool.Name === dummyUserPoolInformation.poolName
  );

  const listUserPoolCliCommand = new ListUserPoolClientsCommand({
    UserPoolId: targetPool.Id,
  });
  const listUserPoolCliRes = await client.send(listUserPoolCliCommand);
  const targetClient = listUserPoolCliRes.UserPoolClients.find(
    (cli) => cli.ClientName === dummyUserPoolInformation.userPoolClientName
  );

  const describeUserPoolCommand = new DescribeUserPoolCommand({
    UserPoolId: targetPool.Id,
  });
  const describeUserPoolRes = await client.send(describeUserPoolCommand);
  const userPoolArn = describeUserPoolRes.UserPool.Arn;

  const env = {
    HttpApiGateway: {
      // "arn:aws:cognito-idp:${region}:${account-id}:userpool/${user-pool-id}"
      HTTP_API_USER_POOL_ARN: userPoolArn,
      HTTP_API_USER_POOL_ID: targetPool.Id,
    },
    UserPoolClient: {
      USER_POOL_CLIENT_ID: targetClient.ClientId,
    },
  };

  fs.writeFile(
    path.resolve(__filename, "../../../resources/tmp.env.json"),
    JSON.stringify(env)
  );
};

module.exports = main;
