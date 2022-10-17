/**
 * A simple example includes a HTTP get method to get one item by id from a DynamoDB table.
 */
 exports.getByIdHandler = async (event) => {
  if (event.requestContext.http.method !== 'GET') {
    console.log(event.requestContext);
    throw new Error(`getMethod only accept GET method, you tried: ${event.requestContext.http.method}`);
  }
  // All log statements are written to CloudWatch
  console.info('received:', event.pathParameters);
 
  // Get id from pathParameters from APIGateway because of `/{id}` at template.yaml
  const id = event.pathParameters.id;
 
  // Get the item from the table
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html#get-property
  const item = { id: 'id1' };
 
  const response = JSON.stringify(item);
 
  // All log statements are written to CloudWatch
  console.info(`response from: ${event.rawPath} statusCode: 200 body: ${response}`);
  return response;
}
