#!/bin/bash

# check arguments
if [ "$1" == "" ] ; then
  echo "usage: $0 <target CDF name>" ["DESCRIPTION"]
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

API_TOKEN=`cat ../bin/id/apiToken`

MD5=`cat ../target.cdf/${TARGET_NAME}.md5`
SERVER_MD5=`cat ../target.cdf/${TARGET_NAME}.server_md5`
JSON=`cat ../target.cdf/${TARGET_NAME}.json | python3 -c "import sys, json; j=json.load(sys.stdin); print(json.dumps(j,separators=(',',':')), end='');"`

echo -n "uploading - "

if [ "${MD5}" == "${SERVER_MD5}" ] ; then
  echo -n "no changes, skipping - "
else
#######################


  OLD_VERSION=`cat ../target.cdf/${TARGET_NAME}.version`
  NEW_VERSION=$((OLD_VERSION + 1))

  echo -n "VERSION=${OLD_VERSION}->${NEW_VERSION} - "

  RESOURCE=`echo -n ${JSON} | python3 -c "import sys,json; j=sys.stdin.read(); print(json.dumps(j,separators=(',',':')), end='');"`

  echo "{
      \"name\": \"${TARGET_NAME}\",
      \"description\": \"${DESCRIPTION}\",
      \"version\": \"${NEW_VERSION}\",
      \"status\": \"DEPLOYED_ACTIVE\",
      \"creationOption\": \"Save & Deploy\",
      \"resource\": ${RESOURCE}
  }" > $0.req

  curl -sSk \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer ${API_TOKEN}" \
    -X POST \
    "${BASE_URL}/api/process-manager/customDataForms" \
    -d@$0.req \
  > $0.json

  ID=`cat $0.json | python3 -c"import sys, json; print(json.load(sys.stdin)['id'], end='')"`
  echo -n "NEW ID=${ID} - "
fi

echo "DONE"
# return to the initial directory
cd ${CURRENT_DIR}
