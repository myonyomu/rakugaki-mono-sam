const {
  CreateUserPoolCommand,
  CreateUserPoolClientCommand,
  AdminCreateUserCommand,
  ExplicitAuthFlowsType,
  AuthFlowType,
  AdminInitiateAuthCommand,
  ChallengeNameType,
  RespondToAuthChallengeCommand,
} = require("@aws-sdk/client-cognito-identity-provider");

const dummyUserPoolInformation = require("../../resources/dummy-userpool-information.json");
const dummyUserInformation = require("../../resources/dummy-cognito-user.json");

const LocalCognitoIdpClientProvider = require("../../utils/LocalCognitoIdpClientProvider");

const main = async () => {
  const client = LocalCognitoIdpClientProvider.generateProvider();

  // Create User Pool
  const createUserPoolCommand = new CreateUserPoolCommand({
    PoolName: dummyUserPoolInformation.poolName,
  });
  const userPoolCreateRes = await client.send(createUserPoolCommand);
  const userPoolId = userPoolCreateRes.UserPool.Id;
  console.log("finish create userpool: ", userPoolId);

  // Create User Pool Client
  const createUserPoolClientCommand = new CreateUserPoolClientCommand({
    ClientName: dummyUserPoolInformation.userPoolClientName,
    UserPoolId: userPoolId,
    GenerateSecret: false,
    ExplicitAuthFlows: [
      ExplicitAuthFlowsType.ALLOW_USER_PASSWORD_AUTH,
      ExplicitAuthFlowsType.ALLOW_REFRESH_TOKEN_AUTH,
      ExplicitAuthFlowsType.ADMIN_NO_SRP_AUTH,
    ],
  });
  const userPoolClientCreateRes = await client.send(
    createUserPoolClientCommand
  );
  const clientId = userPoolClientCreateRes.UserPoolClient.ClientId;
  console.log("finish create client:", clientId);

  // Create new User
  const createUserCommand = new AdminCreateUserCommand({
    UserPoolId: userPoolId,
    Username: dummyUserInformation.userName,
    TemporaryPassword: dummyUserInformation.tempUserPassword,
    UserAttributes: [
      {
        Name: "email",
        Value: dummyUserInformation.userEmail,
      },
    ],
  });
  const userCreateRes = await client.send(createUserCommand);
  console.log(
    "finish create user:",
    userCreateRes.User.Username,
    userCreateRes.User.UserStatus
  );

  // Change user status: FORCE_CHANGE_PASSWORD => CONFIRMED
  const initiateAuthByTempPasswordCommand = new AdminInitiateAuthCommand({
    AuthFlow: AuthFlowType.ADMIN_NO_SRP_AUTH,
    ClientId: clientId,
    UserPoolId: userPoolId,
    AuthParameters: {
      USERNAME: dummyUserInformation.userName,
      PASSWORD: dummyUserInformation.tempUserPassword,
    },
  });
  const initiateChallengeRes = await client.send(
    initiateAuthByTempPasswordCommand
  );

  const changePasswordCommand = new RespondToAuthChallengeCommand({
    ClientId: clientId,
    ChallengeName: ChallengeNameType.NEW_PASSWORD_REQUIRED,
    Session: initiateChallengeRes.Session,
    ChallengeResponses: {
      USERNAME: dummyUserInformation.userName,
      NEW_PASSWORD: dummyUserInformation.userPassword,
    },
  });
  await client.send(changePasswordCommand);

  console.log("Finish cognito setup.");
};

module.exports = main;
