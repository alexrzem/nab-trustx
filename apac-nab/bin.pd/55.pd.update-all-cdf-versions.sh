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

echo -n "update: "

BPMN_FILE="../target.pd/${PD_NAME}.xml"

# based on https://stackoverflow.com/questions/61911918/select-multiple-elements-with-xmlstarlet
#        <camunda:inputOutput>
#          <camunda:inputParameter name="dataFormName" labelName="Data form name" id="CDF01-i-cdfn_Lrk" skyId="CDF01-i-cdfn" type="STRING">SergeiProgress</camunda:inputParameter>
#          <camunda:inputParameter name="dataFormVersion" labelName="Data form version" id="CDF01-i-cdfv_lwK" skyId="CDF01-i-cdfv" type="STRING">1</camunda:inputParameter>

#  -v "//c:inputOutput[c:inputParameter[@name='dataFormName' and text()='${FUNCTION_NAME}']]/c:inputParameter[@name='dataFormVersion']" \


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
    CDF_VERSION="\${`cat ../target.pd/cdf.${CDF_NAME}.server_version`}"
##    ./61.pd.update-one-cdf-version.sh "${PD_NAME}" "${CDF_NAME}" "${CDF_VERSION}"
  echo -n "${CDF_NAME}->${CDF_VERSION} - "

# based on https://stackoverflow.com/questions/61911918/select-multiple-elements-with-xmlstarlet
#        <camunda:inputOutput>
#          <camunda:inputParameter name="dataFormName" labelName="Data form name" id="CDF01-i-cdfn_Lrk" skyId="CDF01-i-cdfn" type="STRING">SergeiProgress</camunda:inputParameter>
#          <camunda:inputParameter name="dataFormVersion" labelName="Data form version" id="CDF01-i-cdfv_lwK" skyId="CDF01-i-cdfv" type="STRING">1</camunda:inputParameter>

  FOUND=`xmlstarlet sel \
    -N c=http://camunda.org/schema/1.0/bpmn \
    -t \
    -v "//c:inputOutput[c:inputParameter[@name='dataFormName' and text()='${CDF_NAME}']]/c:inputParameter[@name='dataFormVersion' and text()!='${CDF_VERSION}']" \
    -n \
    ${BPMN_FILE}`

#echo "FOUND=${FOUND};"

  if [ "${FOUND}" != "" ] ; then
    echo -n "updating - "
    xmlstarlet edit \
      -L \
      -N c=http://camunda.org/schema/1.0/bpmn \
      --update "//c:inputOutput[c:inputParameter[@name='dataFormName' and text()='${CDF_NAME}']]/c:inputParameter[@name='dataFormVersion']" \
      --value "${CDF_VERSION}" \
      ${BPMN_FILE}
    echo "CDF:${CDF_NAME}:${CDF_VERSION}" >> ${BPMN_FILE}.update
  else
    echo -n "already ok - "
  fi
  echo -n "DONE "

## --
  done < ${BPMN_FILE}.cdf.list

echo ""
# return to the initial directory
cd ${CURRENT_DIR}
