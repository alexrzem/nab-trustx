#!/bin/bash

# checks if all CFs have access to given process variables, correct bpm if not

if [ "$1" == "" ] ; then
  echo "usage: $0 <PD name>"
  exit
fi

# assign variables
PD_NAME=$1

# change dir
CURRENT_DIR=`pwd`
cd `dirname $0`

BPMN_FILE="../target.pd/${PD_NAME}.xml"

TARGET_PVs="idv usedDocumentList selectedDocType _initVars idv_log idv_secret idv_functions"

echo -n "update: "
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
  -v ".//camunda:inputParameter[@name='processVariables']/camunda:list/camunda:value" \
  -o ";" \
  ${BPMN_FILE} | tr '\n' ',' > $0.1

IN=`cat $0.1`
CF_LIST=(${IN//;/ })
#echo ${CF_LIST[20]}
# parse using ';'
for CF_ITEM in ${CF_LIST[@]} ; do
#  echo "CF_ITEM=${CF_ITEM};"
# parse using '='
  CF_PIECES=(${CF_ITEM//=/ })
  CF_ID=${CF_PIECES[0]}
  CF_NAME=${CF_PIECES[1]}
  PV_LIST0=${CF_PIECES[2]}
  PV_LIST1=",${PV_LIST0},"
#  echo "CF_ID=${CF_ID}; PV_LIST1=${PV_LIST1};"
  for PV in ${TARGET_PVs} ; do
    if [[ "${PV_LIST1}" =~ ",${PV}," ]] ; then
      PRESENT="yes"
    else
      PRESENT="no"
    fi
    if [ "${PRESENT}" == "no" ] ; then
      echo -n "${CF_NAME}-${PV} - "
      echo "PV: ${CF_NAME}-${PV}" >> ${BPMN_FILE}.update
      xmlstarlet \
        edit \
        -L \
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
        --subnode "//bpmn:serviceTask[@id='${CF_ID}' and @camunda:delegateExpression='\${syncCloudFunctionExecutorV2}']//camunda:inputParameter[@name='processVariables']/camunda:list" \
        --type elem \
        --name camunda:value \
        --value "${PV}" \
       ${BPMN_FILE}
    fi
  done

done

# return to the initial directory
cd ${CURRENT_DIR}

echo "done"
