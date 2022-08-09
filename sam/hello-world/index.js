"use strict";
console.log("Loading function");

exports.handler = (event, context, callback) => {
  callback(null, {
    statusCode: 200,
    headers: { "x-custom-header": "my custom header value" },
    body: "Hello " + event.body,
  });
};
