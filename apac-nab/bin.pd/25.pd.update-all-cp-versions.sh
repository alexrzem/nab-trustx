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
  CP_VERSION="\${`cat ../target.pd/cp.${CP_NAME}.server_version`}"
    #echo "CP_NAME=${CP_NAME}; CP_VERSION=${CP_VERSION};"
##    ./31.pd.update-one-cp-version.sh "${PD_NAME}" "${CP_NAME}" "${CP_VERSION}"
  echo -n "${CP_NAME}->${CP_VERSION} - "

# extract list of CP with versions
# based on https://stackoverflow.com/questions/61911918/select-multiple-elements-with-xmlstarlet

  FOUND=`xmlstarlet sel \
    -N c=http://camunda.org/schema/1.0/bpmn \
    -t \
    -v "//c:inputOutput[c:inputParameter[@name='customPageName' and text()='${CP_NAME}']]/c:inputParameter[@name='customPageVersion' and text()!='${CP_VERSION}']" \
    -n \
    ${BPMN_FILE}`

#echo "FOUND=${FOUND};"

  if [ "${FOUND}" != "" ] ; then
    xmlstarlet edit \
      -L \
      -N c=http://camunda.org/schema/1.0/bpmn \
      --update "//c:inputOutput[c:inputParameter[@name='customPageName' and text()='${CP_NAME}']]/c:inputParameter[@name='customPageVersion']" \
      --value "${CP_VERSION}" \
      ${BPMN_FILE}
    echo "CP:${CP_NAME}:${CP_VERSION}" >> ${BPMN_FILE}.update
    echo -n "done - "
  else
    echo -n "already ok - "
  fi
  echo -n "done; "
## --
  done < ${BPMN_FILE}.cp.list

echo ""
# return to the initial directory
cd ${CURRENT_DIR}
