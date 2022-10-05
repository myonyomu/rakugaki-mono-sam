const {
  CognitoIdentityProviderClient,
  CreateUserPoolCommand,
  CreateUserPoolClientCommand,
  AdminCreateUserCommand,
  ExplicitAuthFlowsType,
  AuthFlowType,
  AdminInitiateAuthCommand,
  ChallengeNameType,
  RespondToAuthChallengeCommand,
  InitiateAuthCommand,
} = require("@aws-sdk/client-cognito-identity-provider");

const dummyCredentials = require("./dummy-credential.json");
const dummyUserPoolInformation = require("./dummy-userpool-information.json");
const dummyUserInformation = require("./dummy-cognito-user.json");

const config = {
  credentials: dummyCredentials,
  endpoint: "http://localhost:5000", // moto server default endpoint
};

const main = async () => {
  try {
    const client = new CognitoIdentityProviderClient(config);

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
    console.log("Challenge Session:", initiateChallengeRes.Session);

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
    
  } catch (e) {
    console.error(e);
  }
};

main();
