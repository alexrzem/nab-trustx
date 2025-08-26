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

API_TOKEN=`cat ../bin/id/apiToken`

echo -n "get CPs: "

BPMN_FILE="../target.pd/${PD_NAME}.xml"

#        <camunda:inputOutput>
#          <camunda:inputParameter name="customPageName">sk01</camunda:inputParameter>
#          <camunda:inputParameter name="customPageVersion">${2}</camunda:inputParameter>

#  -v "//c:inputOutput[c:inputParameter[@name='dataFormName' and text()='${FUNCTION_NAME}']]/c:inputParameter[@name='dataFormVersion']" \


# extract list of CP with versions
# based on https://stackoverflow.com/questions/61911918/select-multiple-elements-with-xmlstarlet

xmlstarlet sel \
  -N c=http://camunda.org/schema/1.0/bpmn \
  -t \
  -m "//c:inputOutput" \
  -v ".//c:inputParameter[@name='customPageName']" \
  -n \
  ${BPMN_FILE} | uniq > ${BPMN_FILE}.cp.list

while read CP_NAME ; do
  if [ "" == "${CP_NAME}" ] ; then
    continue
  fi
  echo -n "${CP_NAME}:"

  curl -sSk \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer ${API_TOKEN}" \
    -X GET \
    "${BASE_URL}/api/theme-server/customPages/${CP_NAME}/versions?page=0&size=1&sort=version,desc" \
  | python3 -m json.tool > $0.list.json

  CP_VERSION=`cat $0.list.json | python3 -c \
"import sys,json
try:
    version=json.load(sys.stdin)['content'][0]['version']
except:
    version=''
print(str(version), end='')
"`

  echo -n "${CP_VERSION} - "
  mkdir -p ../target.pd
  echo -n "${CP_VERSION}" > ../target.pd/cp.${CP_NAME}.server_version

done < ${BPMN_FILE}.cp.list

echo "done"
# return to the initial directory
cd ${CURRENT_DIR}
