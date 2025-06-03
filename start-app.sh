#!/bin/bash

# Navigate to the server directory and start the server
(cd server && npm start &)

# Navigate to the web-client directory and start the client
(cd web-client && npm run dev &)