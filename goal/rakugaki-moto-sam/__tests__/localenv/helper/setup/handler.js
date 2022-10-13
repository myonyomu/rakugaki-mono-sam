const setupLocalCognito = require("./setup-local-cognito");
const temporaryEnvOutput = require("./temporary-env-output");

const main = async () => {
  try {
    await setupLocalCognito();
    await temporaryEnvOutput();
  } catch (e) {
    console.error(e);
  }
};

main();
