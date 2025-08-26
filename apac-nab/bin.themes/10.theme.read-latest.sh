#!/bin/bash

# check arguments
if [ "$1" == "" ] ; then
  echo "usage: $0 <theme name>"
  exit
fi

# assign variables
THEME_NAME=$1

# change dir
CURRENT_DIR=`pwd`
cd `dirname $0`


# actual scripting
. ../settings.sh

#mkdir -p ../target.th
API_TOKEN=`cat id/apiToken`

#BPMN_FILE="../target.pd/${PD_NAME}.xml"


echo -n "${THEME_NAME} - "
curl -sSk \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${API_TOKEN}" \
  -X GET \
  "${BASE_URL}/api/theme-server/themes/${THEME_NAME}/versions?page=0&size=1&sort=version,desc" \
 | python3 -m json.tool > $0.list.json
ID=`cat $0.list.json | python3 -c "
import sys, json
print(json.load(sys.stdin)['content'][0]['id'], end='')
"`

echo -n "${ID} - "

curl -sSk \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${API_TOKEN}" \
  -X GET \
  "${BASE_URL}/api/theme-server/themes/${ID}/all" \
 | python3 -m json.tool > $0.all.json

mkdir -p data/${THEME_NAME}
cp $0.all.json data/${THEME_NAME}/_all.json

# extract assets

cat $0.all.json | python3 -c "
import sys, json, urllib.request, os
from urllib.parse import urlparse, unquote

p = json.load(sys.stdin)
for v in p['assets']['global']:
    name=v['name']
    path=v['path']
    with urllib.request.urlopen(path) as f:
        data = f.read()
    d = 'data/${THEME_NAME}/' + name
    if not os.path.exists(d):
        os.makedirs(d)
    fileName = unquote(urlparse(path).path.split('/')[-1])
    print(f'{fileName} - ', end='')
    with open(d + '/' + fileName, 'wb') as f:
        f.write(data)    
#    print('.', end='')
"

echo "DONE"
# return to the initial directory
cd ${CURRENT_DIR}
