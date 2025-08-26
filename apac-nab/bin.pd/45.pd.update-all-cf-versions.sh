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

echo -n "update CF versions: "

BPMN_FILE="../target.pd/${PD_NAME}.xml"

# extract list of CP with versions
# based on https://stackoverflow.com/questions/61911918/select-multiple-elements-with-xmlstarlet

xmlstarlet \
  sel \
  -N c=http://camunda.org/schema/1.0/bpmn \
  -N bpmn=http://www.omg.org/spec/BPMN/20100524/MODEL \
  -N bioc=http://bpmn.io/schema/bpmn/biocolor/1.0 \
  -N bpmndi=http://www.omg.org/spec/BPMN/20100524/DI \
  -N camunda=http://camunda.org/schema/1.0/bpmn \
  -N color=http://www.omg.org/spec/BPMN/non-normative/color/1.0 \
  -N dc=http://www.omg.org/spec/DD/20100524/DC \
  -N di=http://www.omg.org/spec/DD/20100524/DI \
  -N xsi=http://www.w3.org/2001/XMLSchema-instance \
  -N modeler=http://camunda.org/schema/modeler/1.0 \
  -t \
  -m "//bpmn:serviceTask[@camunda:delegateExpression='\${syncCloudFunctionExecutorV2}']" \
  -v "./@id" \
  -o "=" \
  -v ".//camunda:inputParameter[@name='functionName']" \
  -o "=" \
  -v ".//camunda:inputParameter[@name='functionVersion']" \
  -o ";" \
  ${BPMN_FILE} | tr '\n' ',' > ${BPMN_FILE}.cf.list2
  chmod a+rw ${BPMN_FILE}.cf.list2

IN=`cat ${BPMN_FILE}.cf.list2`
CF_LIST=(${IN//;/ })

for CF_ITEM in ${CF_LIST[@]} ; do
#  echo "CF_ITEM=${CF_ITEM};"
# parse using '='
  CF_PIECES=(${CF_ITEM//=/ })
  CF_ID=${CF_PIECES[0]}
  CF_NAME=${CF_PIECES[1]}
  CF_VERSION=${CF_PIECES[2]}
  CF_SERVER_VERSION="\${`cat ../target.pd/cf.${CF_NAME}.server_version`}"
  echo -n "${CF_NAME}->${CF_VERSION} - "
  if [ "${CF_VERSION}" != "${CF_SERVER_VERSION}" ] ; then
    xmlstarlet edit \
      -L \
      -N c=http://camunda.org/schema/1.0/bpmn \
      --update "//c:inputOutput[c:inputParameter[@name='functionName' and text()='${CF_NAME}']]/c:inputParameter[@name='functionVersion']" \
      --value "${CF_SERVER_VERSION}" \
      ${BPMN_FILE}
    echo "CF:${CF_NAME}:${CF_SERVER_VERSION}" >> ${BPMN_FILE}.update
    echo -n "done - "
  else
    echo -n "already ok - "
  fi
  echo -n "done; "
done


exit
while read CF_NAME ; do
  if [ "" == "${CF_NAME}" ] ; then
    continue
  fi
  CF_VERSION="\${`cat ../target.pd/cf.${CF_NAME}.server_version`}"
    #echo "CP_NAME=${CP_NAME}; CP_VERSION=${CP_VERSION};"
##    ./31.pd.update-one-cp-version.sh "${PD_NAME}" "${CP_NAME}" "${CP_VERSION}"
  echo -n "${CF_NAME}->${CF_VERSION} - "

# extract list of CP with versions
# based on https://stackoverflow.com/questions/61911918/select-multiple-elements-with-xmlstarlet

  FOUND=`xmlstarlet sel \
    -N c=http://camunda.org/schema/1.0/bpmn \
    -t \
    -o "version=" \
    -v "//c:inputOutput[c:inputParameter[@name='functionName' and text()='${CF_NAME}']]/c:inputParameter[@name='functionVersion' and (text()!='${CF_VERSION}')]" \
    -n \
    ${BPMN_FILE}`

echo ""

# return to the initial directory
cd ${CURRENT_DIR}
