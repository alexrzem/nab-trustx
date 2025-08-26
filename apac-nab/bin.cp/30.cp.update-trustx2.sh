#!/bin/bash

# check arguments
if [ "$2" == "" ] ; then
  echo "usage: $0 <target CP name>" "DESCRIPTION"
  exit
fi

# assign variables
TARGET_NAME=$1
DESCRIPTION="$2"

# change dir
CURRENT_DIR=`pwd`
cd `dirname $0`
# pwd

# actual scripting
. ../settings.sh

ARCHIVE=`cat ../target.cp/${TARGET_NAME}.zip | python3 -c "import base64,sys;print(base64.b64encode(sys.stdin.buffer.read()).decode(),end='')"`
API_TOKEN=`cat ../bin/id/apiToken`
MD5=`cat ../target.cp/${TARGET_NAME}.md5`
SERVER_MD5=`cat ../target.cp/${TARGET_NAME}.server_md5`

echo -n "uploading - "

if [ "${MD5}" == "${SERVER_MD5}" ] ; then
  echo -n "no changes, skipping - "
else
  echo "{
      \"name\": \"${TARGET_NAME}\",
      \"description\": \"${DESCRIPTION}\",
      \"archive\": \"${ARCHIVE}\",
      \"creationOption\": \"Save & Deploy\"
  }" > $0.req

# step1 - update CP
  curl -sSk \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer ${API_TOKEN}" \
    -X POST \
    "${BASE_URL}/api/theme-server/customPages" \
    -d @$0.req \
  > $0.1.json

  ID=`cat $0.1.json | python3 -c "import sys, json; print(json.load(sys.stdin)['id'], end='');"`
  echo -n "new ID=${ID} - activating - "

# step 2 - activate PD
  curl -sSk \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer ${API_TOKEN}" \
    -X POST \
    "${BASE_URL}/api/theme-server/customPages/${ID}/status/DEPLOYED_ACTIVE" \
  > $0.2.json
fi

echo "DONE"
# return to the initial directory
cd ${CURRENT_DIR}
