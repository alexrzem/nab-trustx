#!/bin/bash


# check arguments
if [ "$1" == "" ] ; then
  echo "usage: $0 <target CP name>"
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

API_TOKEN=`cat ${SCRIPT_DIR}/../bin/id/apiToken`

URL="${BASE_URL}/api/theme-server/customPages/${TARGET_NAME}/versions?page=0&size=1&sort=version,desc"

#echo -n "reading md5 for ${TARGET_NAME} - "
curl -sSk \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${API_TOKEN}" \
  -X GET \
  "${URL}" \
| python3 -m json.tool > $0.list.json

ID=`cat $0.list.json | python3 -c "import sys, json; print(str(json.load(sys.stdin)['content'][0]['id']), end='')"`

echo -n "ID=${ID} - "

curl -sSk \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${API_TOKEN}" \
  -X GET \
  "${BASE_URL}/api/theme-server/customPages/${ID}" \
| python3 -m json.tool > $0.id.json

SERVER_MD5=`cat $0.id.json | python3 -c "
import sys, json, re
j=json.load(sys.stdin)

for v in j['archiveEntries']:
    p = re.compile('^/assets/md5/(.*).html$')
    m = p.match(v['path'])
    if m:
        hash = m.group(1)
        print(hash, end='')
        break
"`
echo -n "SERVER_MD5=${SERVER_MD5} - "

mkdir -p ../target.cp
echo -n "${SERVER_MD5}" > ../target.cp/${TARGET_NAME}.server_md5
#echo "DONE"

# return to the initial directory
cd ${CURRENT_DIR}
