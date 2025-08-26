#!/bin/bash

# check arguments
if [ "$2" == "" ] ; then
  echo "usage: $0 <source folder> <theme name>"
  exit
fi
THEME_PATH=$1
THEME_NAME=$2


# change dir
CURRENT_DIR=`pwd`
cd `dirname $0`


# actual scripting
. ../settings.sh

#mkdir -p ../target.th
API_TOKEN=`cat id/apiToken`


# assign variables
echo -n "${THEME_NAME} - "

if [ "1" == "1" ] ; then

# construct initial json
cat ${THEME_PATH}/_all.json | python3 -c "
import sys, json
a = json.load(sys.stdin)
b = {}
b['name'] = '${THEME_NAME}'
b['description'] = a['description']
b['palette'] = a['palette']
b['status'] = 'EDITABLE'
print(json.dumps(b, indent=4), end='')
"> $0.create.json


# create initial theme
curl -sSk \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${API_TOKEN}" \
  -X POST \
  "${BASE_URL}/api/theme-server/themes" \
  -d @$0.create.json \
 | python3 -m json.tool > $0.1.json

# get id
ID=`cat $0.1.json | python3 -c "
import sys, json
print(json.load(sys.stdin)['id'], end='')
"`
echo -n "${ID} - "

fi

# add assets here
for d in ${THEME_PATH}/*/ ; do
  for f in $d* ; do
    python3 -c "
import json, os, base64, mimetypes
fileName = '${f}'

name = os.path.basename(fileName).split('.')[0]
ext = os.path.basename(fileName).split('.')[1]
mime_type, encoding = mimetypes.guess_type(fileName)
if mime_type == None:
    mime_type = 'application/octet-stream'

with open(fileName, 'rb') as f:
    r = f.read()
    res = base64.b64encode(r).decode()

c = {
    'name': name,
    'contentType': mime_type,
    'fileExtension': ext,
    'assetResource': res
}
print(json.dumps(c, indent=4), end='')
" > $0.a1.json

  curl -sSk \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer ${API_TOKEN}" \
    -X POST \
    "${BASE_URL}/api/theme-server/themes/${ID}/assets/" \
    -d @$0.a1.json \
   | python3 -m json.tool > $0.a2.json
  echo -n "."
  done
done

# activate
curl -sSk \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${API_TOKEN}" \
  -X POST \
  "${BASE_URL}/api/theme-server/themes/${ID}/status/DEPLOYED_ACTIVE" \
 | python3 -m json.tool > $0.2.json

echo -n "${ID} - "


echo "DONE"
# return to the initial directory
cd ${CURRENT_DIR}
