#!/bin/bash
cd /home/kavia/workspace/code-generation/eventsecure-rfid-access-control-102518-03177c20/eventsecure_rfid_access_control
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

