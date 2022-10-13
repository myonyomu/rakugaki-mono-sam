const AuthorizationProvider = require("../utils/LocalAuthorizationProvider");

describe("Integration test in local", () => {
  it("can access with cognito dummy", async () => {
    const authProvider = new AuthorizationProvider();
    const auth = await authProvider.generateAuth();
    
  });
});
