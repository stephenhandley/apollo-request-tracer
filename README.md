# Apollo Request Tracer
Extension for tracing GraphQL query resolution in [ApolloServer](https://github.com/apollographql/apollo-server)

Primary motivation of this lib is tracking cold and warm start performance of GraphQL in serverless environments ([AWS Lambda](https://aws.amazon.com/Lambda/serverless), [Google Cloud Functions](https://cloud.google.com/functions/))

## Usage
```js
// Create a new tracer
const Tracer = require('apollo-request-tracer');
const tracer = Tracer.start();

// Create a timer tracking how long node module import takes
let requireTimer = tracer.time('module_requires');
const Express = require('Express');
const {ApolloServer, gql} = require('apollo-server-express');
const Functions = require('firebase-functions');
const Models = require('./Models');
// Stop the timer
requireTimer.stop();

// Create a timer tracking how long the initial GraphQL setup takes
let setupTimer = tracer.time('graphql_setup');

const typeDefs = gql`
  type Query {
    hello(name: String): String
  }
`;

const resolvers = {
  Query: {
    hello: async (args, context)=> {
      // Request tracer gets added to resolver context and can be used
      // for adding timing information specific to that resolver
      const {tracer} = context;
      const timer = tracer.time('build_hello_message');
      const message = `Hello ${args.name}!`;
      timer.stop();
      return message;
    }
  }
};

// Create a new ApolloServer with tracer extension that tracks
// the graphql query resolution process
const server = new ApolloServer({
  typeDefs,
  resolvers,
  extensions: [tracer.request]
});

const app = Express();
server.applyMiddleware({app, path: '/'});

module.exports = {
  graphql: Functions.https.onRequest(app);
};

// Stop setup timer and tracer
setupTimer.stop();
tracer.stop();
```
