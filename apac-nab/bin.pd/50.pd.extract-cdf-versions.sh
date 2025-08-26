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

echo -n "get CDFs: "

BPMN_FILE="../target.pd/${PD_NAME}.xml"

#        <camunda:inputOutput>
#          <camunda:inputParameter name="dataFormName" labelName="Data form name" id="CDF01-i-cdfn_Lrk" skyId="CDF01-i-cdfn" type="STRING">SergeiProgress</camunda:inputParameter>
#          <camunda:inputParameter name="dataFormVersion" labelName="Data form version" id="CDF01-i-cdfv_lwK" skyId="CDF01-i-cdfv" type="STRING">1</camunda:inputParameter>

#  -v "//c:inputOutput[c:inputParameter[@name='dataFormName' and text()='${FUNCTION_NAME}']]/c:inputParameter[@name='dataFormVersion']" \


# extract list of CDF with versions
# based on https://stackoverflow.com/questions/61911918/select-multiple-elements-with-xmlstarlet

xmlstarlet sel \
  -N c=http://camunda.org/schema/1.0/bpmn \
  -t \
  -m "//c:inputOutput" \
  -v ".//c:inputParameter[@name='dataFormName']" \
  -n \
  ${BPMN_FILE} | uniq > ${BPMN_FILE}.cdf.list



while read CDF_NAME ; do
  if [ "" == "${CDF_NAME}" ] ; then
    continue
  fi
  echo -n "${CDF_NAME}:"

  curl -sSk \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer ${API_TOKEN}" \
    -X GET \
    "${BASE_URL}/api/process-manager/customDataForms/${CDF_NAME}/versions?page=0&size=1&sort=version,desc" \
  | python3 -m json.tool > $0.list.json

  CDF_VERSION=`cat $0.list.json | python3 -c \
"import sys,json
try:
    version=json.load(sys.stdin)['content'][0]['version']
except:
    version=''
print(str(version), end='')
"`

  echo -n "${CDF_VERSION} - "
  mkdir -p ../target.pd
  echo -n "${CDF_VERSION}" > ../target.pd/cdf.${CDF_NAME}.server_version
  cp $0.list.json ../target.pd/cdf.${CDF_NAME}.json

done < ${BPMN_FILE}.cdf.list

echo "done"
# return to the initial directory
cd ${CURRENT_DIR}
