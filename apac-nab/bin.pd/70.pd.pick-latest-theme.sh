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


if [ -f "../target.pd/${PD_NAME}.theme" ] ; then
  THEME_ID=`cat "../target.pd/${PD_NAME}.theme"`
else
  THEME_ID=""
fi

if [ "" == "${THEME_ID}" ] ; then 
  echo -n "no theme id, no actions - "
else
  echo -n "THEME_ID=${THEME_ID} - "
# get theme
  curl -sSk \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer ${API_TOKEN}" \
    -X GET \
    "${BASE_URL}/api/theme-server/themes/${THEME_ID}/all" \
   > $0.json
# get theme name
  THEME_NAME=`cat $0.json | python3 -c "
import sys, json
print(json.load(sys.stdin)['name'], end='')
"`
  echo -n "THEME_NAME=${THEME_NAME} - "

# get theme versions
  curl -sSk \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer ${API_TOKEN}" \
    -X GET \
    "${BASE_URL}/api/theme-server/themes/${THEME_NAME}/versions?page=0&size=1&sort=version,desc" \
   > $0.list.json

# pick the latest
  NEW_THEME_ID=`cat $0.list.json | python3 -c "import sys,json; print(json.load(sys.stdin)['content'][0]['id'], end='')"`
  echo -n "NEW_THEME_ID=${NEW_THEME_ID} - "
  NEW_THEME_VERSION=`cat $0.list.json | python3 -c "import sys,json; print(json.load(sys.stdin)['content'][0]['version'], end='')"`

  if [ "" != "${NEW_THEME_ID}" ] && [ "${THEME_ID}" != "${NEW_THEME_ID}" ] ; then
# update file  
    echo -n "NEW_THEME_VERSION=${NEW_THEME_VERSION} - "
    echo -n "${NEW_THEME_ID}" > ../target.pd/${PD_NAME}.theme
    echo "THEME:${THEME_NAME}:${NEW_THEME_VERSION}" >> ${BPMN_FILE}.update
  fi
fi

echo "DONE"
# return to the initial directory
cd ${CURRENT_DIR}
