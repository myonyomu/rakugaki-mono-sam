const AuthorizationProvider = require("../utils/LocalAuthorizationProvider");
const got = require("got");

describe("Integration test in local", () => {
  it("can access with cognito dummy", async () => {
    const authProvider = new AuthorizationProvider();
    const auth = await authProvider.generateAuth();

    const accessToken = auth.AuthenticationResult.AccessToken;
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };
    const id = 1;
    const url = `http://127.0.0.1:3000/${id}`;
    const data = await got(url, { headers, method: "GET" }).json();

    const expected = { id: "id1" };
    expect(expected).toEqual(data);
  });
});
