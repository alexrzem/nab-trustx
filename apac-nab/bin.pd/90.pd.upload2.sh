#!/bin/bash
# exit
# check arguments
if [ "$1" == "" ] ; then
  echo "usage: $0 <PD name>"
  exit
fi

# assign variables
PD_NAME=$1

# change dir
CURRENT_DIR=`pwd`
cd `dirname $0`


# actual scripting
. ../settings.sh

API_TOKEN=`cat ../bin/id/apiToken`

BPMN_FILE="../target.pd/${PD_NAME}.xml"

if [ -f "${BPMN_FILE}.update" ] ; then
  echo -n "uploading - "
  DATA=`cat ${BPMN_FILE} | python3 -c "import base64,sys;print(base64.b64encode(sys.stdin.buffer.read()).decode(),end='')"`


  if [ -f "../target.pd/${PD_NAME}.theme" ] ; then
    THEME_ID=`cat "../target.pd/${PD_NAME}.theme"`
    echo "{
      \"name\": \"${PD_NAME}\",
      \"description\": \"${PD_NAME} - uploaded by script\",
      \"serverType\": \"P1\",
      \"resources\": {
          \"bpmn\": {
              \"data\": \"${DATA}\",
              \"type\": \"BPMN\"
          }
      },
      \"processDefinitionType\": \"VERIFICATION\",
      \"attributes\": {
          \"searchable\": true
      },
    \"themeId\": \"${THEME_ID}\"
    }" > $0.1.req
  else
    echo "{
      \"name\": \"${PD_NAME}\",
      \"description\": \"${PD_NAME} - uploaded by script\",
      \"serverType\": \"P1\",
      \"resources\": {
          \"bpmn\": {
              \"data\": \"${DATA}\",
              \"type\": \"BPMN\"
          }
      },
      \"processDefinitionType\": \"VERIFICATION\",
      \"attributes\": {
          \"searchable\": true
      }
    }" > $0.1.req
  fi

  curl -sSk \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer ${API_TOKEN}" \
    -X POST \
    "${BASE_URL}/api/process-manager/processDefinitions" \
    -d@$0.1.req \
  > $0.1.json

  ID=`cat $0.1.json | python3 -c "import sys, json; print(json.load(sys.stdin)['id'], end='');"`
  echo -n "${ID} - "

  curl -sSk \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer ${API_TOKEN}" \
    -X POST \
    "${BASE_URL}/api/process-manager/processDefinitions/${ID}/status/DEPLOYED_ACTIVE" \
  > $0.2.json
else
  echo -n "no update - "
fi
echo "DONE"

# return to the initial directory
cd ${CURRENT_DIR}
