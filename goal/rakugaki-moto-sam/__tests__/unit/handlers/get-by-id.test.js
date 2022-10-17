// Import all functions from get-by-id.js
const lambda = require("../../../src/handlers/get-by-id.js");
const eventJson = require("../../../events/http-api-proxy-event-example.json");

// This includes all tests for getByIdHandler()
describe("Test getByIdHandler", () => {
  // This test invokes getByIdHandler() and compare the result
  it("should get item by id", async () => {
    // Invoke getByIdHandler()
    const result = await lambda.getByIdHandler(eventJson);

    const item = { id: "id1" };
    const expectedResult = JSON.stringify(item);

    // Compare the result with the expected result
    expect(result).toEqual(expectedResult);
  });
});
