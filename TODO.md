# List of Todos/Issues

## Frontend

1. `index-success.js` needs some tidying.
   - Currently having around 450 lines.

## Chatbot

- Turn admin account into chatbot
  - Call take_support_request periodically

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
