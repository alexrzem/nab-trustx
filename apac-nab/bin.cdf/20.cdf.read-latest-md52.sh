#!/bin/bash


# check arguments
if [ "$1" == "" ] ; then
  echo "usage: $0 <target CDF name>"
  exit
fi

# assign variables
TARGET_NAME=$1

# change dir
CURRENT_DIR=`pwd`
SCRIPT_DIR=`dirname $0`
cd ${SCRIPT_DIR}

# actual scripting
. ../settings.sh

#echo -n "reading md5 for ${TARGET_NAME} - "

API_TOKEN=`cat ${SCRIPT_DIR}/../bin/id/apiToken`
curl -sSk \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${API_TOKEN}" \
  -X GET \
  "${BASE_URL}/api/process-manager/customDataForms/${TARGET_NAME}/versions?page=0&size=1&sort=version,desc" \
| python3 -m json.tool > $0.list.json


# extract id
CDF_ID=`cat $0.list.json | python3 -c"
import sys, json; print(json.load(sys.stdin)['content'][0]['id'], end='')
"`
echo -n "ID=${CDF_ID} - "

# get CDF itself
curl -sSk \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${API_TOKEN}" \
  -X GET \
  "${BASE_URL}/api/process-manager/customDataForms/${CDF_ID}" \
| python3 -m json.tool > $0.json

# get its body
# extract id
CDF_BODY=`cat $0.json | python3 -c"import sys, json; print(json.load(sys.stdin)['resource'], end='')"`
SERVER_MD5=`echo  ${CDF_BODY} | python3 -m json.tool | python3 -c "import hashlib,sys;print(hashlib.md5(sys.stdin.buffer.read()).hexdigest(),end='')"`
VERSION=`cat $0.json | python3 -c"import sys, json; print(json.load(sys.stdin)['version'], end='')"`

echo -n "SERVER_MD5=${SERVER_MD5} - VERSION=${VERSION} - "

mkdir -p ../target.cdf
echo -n "${SERVER_MD5}" > ../target.cdf/${TARGET_NAME}.server_md5
echo -n "${VERSION}" > ../target.cdf/${TARGET_NAME}.version
#echo "DONE"

# return to the initial directory
cd ${CURRENT_DIR}
