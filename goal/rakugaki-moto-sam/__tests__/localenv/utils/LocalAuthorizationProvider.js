const {
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
  ListUserPoolsCommand,
  ListUserPoolClientsCommand,
  AuthFlowType,
} = require("@aws-sdk/client-cognito-identity-provider");

const dummyUserPoolInformation = require("../resources/dummy-userpool-information.json");
const dummyUserInformation = require("../resources/dummy-cognito-user.json");

const LocalCognitoIdpClientProvider = require("./LocalCognitoIdpClientProvider");

class LocalAuthorizationProvider {
  /**
   * Find pool by name => Find pool client by pool id => Initiate auth with userpool client id
   * @return {InitiateAuthCommandOutput}
   */
  async generateAuth() {
    const client = LocalCognitoIdpClientProvider.generateProvider();

    const listUserPoolCommand = new ListUserPoolsCommand({
      UserPoolId: dummyUserPoolInformation.UserPoolId,
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

    const initiateAuthCommand = new InitiateAuthCommand({
      AuthFlow: AuthFlowType.USER_PASSWORD_AUTH,
      ClientId: targetClient.ClientId,
      AuthParameters: {
        USERNAME: dummyUserInformation.userName,
        PASSWORD: dummyUserInformation.userPassword,
      },
    });
    return await client.send(initiateAuthCommand);
  }
}

module.exports = LocalAuthorizationProvider;
