#!/bin/bash

# Start a local http proxy that forwards :7072 to the api container on :7071
# This is necessary because the swa cli, which is the main processes in this
# container, does not accept non-localhost connections. The api is running in
# it's own container, so this proxy is run as a background process to facilitate
# that communication.
./node_modules/http-proxy-cli/bin/http-proxy.js --port 7072 http://api:7071 &

# Start the swa cli emulator, listening for :3000 as a result of the --run yarn start command
# and also for the proxy started above to the api container.
./node_modules/@azure/static-web-apps-cli/dist/cli/bin.js start http://localhost:3000 --run "yarn start" --api-location "http://localhost:7072" &

# Wait for any process to exit
wait -n

# Exit with status of process that exited first
exit $?
