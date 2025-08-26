#!/bin/bash


if [ "$1" == "" ] ; then
  echo "usage: $0 <PD name>"
  exit
fi

BASE_NAME=`basename $0`

# assign variables
PD_NAME=$1

# change dir
CURRENT_DIR=`pwd`
cd `dirname $0`

# actual scripting
. ../settings.sh

API_TOKEN=`cat ../bin/id/apiToken`

BPMN_FILE="../target.pd/${PD_NAME}.xml"

# extract list of CP with versions
# based on https://stackoverflow.com/questions/61911918/select-multiple-elements-with-xmlstarlet

xmlstarlet sel \
  -N c=http://camunda.org/schema/1.0/bpmn \
  -t \
  -m "//c:inputOutput" \
  -v ".//c:inputParameter[@name='functionName']" \
  -n \
  ${BPMN_FILE} | uniq > ${BPMN_FILE}.cf.list

while read CF_NAME ; do
  if [ "" == "${CF_NAME}" ] ; then
    continue
  fi
  echo -n "${CF_NAME}:"

  curl -sSk \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer ${API_TOKEN}" \
    -X GET \
    "${BASE_URL}/api/process-manager/cloudFunctions/${CF_NAME}/versions?page=0&size=1&sort=version,desc" \
  | python3 -m json.tool > ${BASE_NAME}.list.json

  chmod a+rw ${BASE_NAME}.list.json

  CF_VERSION=`cat ${BASE_NAME}.list.json | python3 -c \
"import sys,json
try:
    version=json.load(sys.stdin)['content'][0]['version']
except:
    version=''
print(str(version), end='')
"`

  echo -n "${CF_VERSION} - "
  mkdir -p ../target.pd
  echo -n "${CF_VERSION}" > ../target.pd/cf.${CF_NAME}.server_version

done < ${BPMN_FILE}.cf.list

echo "done"
# return to the initial directory
cd ${CURRENT_DIR}
