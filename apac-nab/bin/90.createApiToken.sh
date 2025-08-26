#!/bin/bash

# change dir
CURRENT_DIR=`pwd`
cd `dirname $0`
# pwd

# actual scripting
. ../settings.sh

mkdir -p id
mkdir -p data

echo -n "creating API token - "

#echo "SECRET=${SECRET};"

curl -sSk \
  -H "X-Api-Key: ${SECRET}" \
  -X POST \
  "${BASE_URL}/api/arthr/apiKeys/issue" \
 > $0.json

API_TOKEN=`cat $0.json | python3 -c "import sys, json; print(json.load(sys.stdin)['token'], end='');"`
#echo "API_TOKEN=${API_TOKEN};"
echo -n "${API_TOKEN}" > id/apiToken

echo "DONE"
# return to the initial directory
cd ${CURRENT_DIR}
