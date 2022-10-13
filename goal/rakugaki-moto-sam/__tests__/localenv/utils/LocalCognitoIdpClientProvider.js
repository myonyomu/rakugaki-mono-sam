const {
  CognitoIdentityProviderClient,
} = require("@aws-sdk/client-cognito-identity-provider");

const dummyCredentials = require("../resources/dummy-credential.json");

class LocalCognitoIdpClientProvider {
  /**
   * Find pool by name => Find pool client by pool id => Initiate auth with userpool client id
   * @return {InitiateAuthCommandOutput}
   */
  static generateProvider() {
    return new CognitoIdentityProviderClient({
      credentials: dummyCredentials,
      endpoint: "http://localhost:5000", // moto server default endpoint
    });
  }
}

module.exports = LocalCognitoIdpClientProvider;
