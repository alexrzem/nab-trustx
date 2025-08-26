#!/bin/bash

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

mkdir -p ../target.pd
API_TOKEN=`cat ../bin/id/apiToken`

BPMN_FILE="../target.pd/${PD_NAME}.xml"


echo -n "${PD_NAME} - "
curl -sSk \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${API_TOKEN}" \
  -X GET \
  "${BASE_URL}/api/process-manager/processDefinitions/${PD_NAME}/versions?page=0&size=1&sort=version,desc" \
 > ../target.pd/${PD_NAME}.list.json

PD_ID=`cat ../target.pd/${PD_NAME}.list.json | python3 -c "
import sys, json
print(json.load(sys.stdin)['content'][0]['processDefinitionId'], end='')
"`

echo -n "${PD_ID} - "

curl -sSk \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${API_TOKEN}" \
  -X GET \
  "${BASE_URL}/api/process-manager/processDefinitions/${PD_ID}" \
 | python3 -m json.tool > ../target.pd/${PD_NAME}.json


THEME_ID=`cat ../target.pd/${PD_NAME}.json | python3 -c "
import sys, json
print(json.load(sys.stdin).get('themeId', ''), end='')
"`
echo -n "THEME_ID=${THEME_ID} - "

if [ "" == "${THEME_ID}" ] ; then
  rm -f  ../target.pd/${PD_NAME}.theme
else
  echo -n "${THEME_ID}" > ../target.pd/${PD_NAME}.theme
fi

curl -sSk \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${API_TOKEN}" \
  -X GET \
  "${BASE_URL}/api/process-manager/processDefinitions/${PD_ID}/bpmnFile" \
 > ${BPMN_FILE}0

xmlstarlet fo ${BPMN_FILE}0 > ${BPMN_FILE}

cp ${BPMN_FILE} ${BPMN_FILE}.server

rm -f ${BPMN_FILE}.update


echo "DONE"
# return to the initial directory
cd ${CURRENT_DIR}
