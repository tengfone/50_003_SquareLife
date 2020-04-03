# List of Todos/Issues

## Frontend

1. **Methods that involve the Websocket Connection like `waitForAgent()` do not account for timeout (rejected Promises).**
   - Refer to RoutingEngine `wait_for_agent` method regarding the timeout conditions.
   - Need to periodically invoke `waitForAgent()` if timeout happens.
2. Sometimes the support request is not closed properly. \
   _E.g. user closes the page/navigates to some other page._
   - Ensure that support request is closed before leaving the page otherwise the agent will be stuck in the "assigned" state.
3. Within `async` functions, variables/function calls with the `await` keyword should be wrapped in a try/catch block if possible.
4. `index-success.js` needs some tidying.
   - Currently having around 450 lines.

## Routing Engine

1. Requires extensive testing due to worker threads sharing resources (CS Problem).
2. Admin Methods have yet to be tested with the current implementation.
3. Currently all agents are initialised when starting the server.
   - Unsure if there are any implications going forward...

#

### Side Note

If you want to use your own rainbow account and agents do remember to change the credentials in following files \
`FrontEnd/rainbowSDK/secrets.js`\
`FrontEnd/rainbowSDK/config.js`\
`routingengine/src/main/java/com/routingengine/AgentCredentials.java`\
Socket can be used as a tool to manual test the routing engine from the browser.\
Run the following code in order to start the socket testing server.

```
npm i
node server.js
```
