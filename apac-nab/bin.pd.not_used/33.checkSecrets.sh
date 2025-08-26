#!/bin/bash

CF_NAMES_TO_SKIP="ConfigureStep1 ConfigureStep2"

#  for nameNode in cf.findall(".//camunda:inputParameter[@name='functionName']", ns):

TARGET_SECRETs='${idv.configSecrets[0]} ${idv.configSecrets[1]} ${idv.configSecrets[2]} ${idv.configSecrets[3]} ${idv.configSecrets[4]} ${idv.configSecrets[5]} ${idv.configSecrets[6]} ${idv.configSecrets[7]} ${idv.configSecrets[8]} ${idv.configSecrets[9]}'

if [ "$1" == "" ] ; then
  echo "usage: $0 <bpm file>"
  exit
fi

BPMN_FILE=$1


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
  -v ".//camunda:inputParameter[@name='cloudSecrets']/camunda:list/camunda:value" \
  -o ";" \
  ${BPMN_FILE} | tr '\n' ',' > $0.1


cat $0.1 | tr '\n' ',' > $0.2
#processVariablesPath = ".//camunda:inputParameter[@name='processVariables']/camunda:list"
#cloudSecretsPath = ".//camunda:inputParameter[@name='cloudSecrets']/camunda:list"

IN=`cat $0.2`
CF_LIST=(${IN//;/ })
#echo ${CF_LIST[20]}
# parse using ';'
for CF_ITEM in ${CF_LIST[@]} ; do
#  echo "CF_ITEM=${CF_ITEM};"
# parse using '='
  CF_PIECES=(${CF_ITEM//=/ })
  CF_ID=${CF_PIECES[0]}
  CF_NAME=${CF_PIECES[1]}
  SECRET_LIST0=${CF_PIECES[2]}
  SECRET_LIST1=",${SECRET_LIST0},"
  for SECRET in ${TARGET_SECRETs} ; do
    if [[ "${SECRET_LIST1}" =~ ",${SECRET}," ]] ; then
      UPDATE="no"
    else
      UPDATE="yes"
    fi
    if [[ " ${CF_NAMES_TO_SKIP} " =~ " ${CF_NAME} " ]] ; then
      UPDATE="skip"
      echo -n "${CF_ID}+${CF_NAME}+${SECRET} - skip -"
    fi
    if [ "${UPDATE}" == "yes" ] ; then
#      echo "== CF_ID=${CF_ID}; SECRET_LIST0=${SECRET_LIST0}; CF_ITEM=${CF_ITEM}; =="
      echo -n "${CF_NAME}+${SECRET} - "
      echo "secret: ${CF_NAME}+${SECRET}" >> ${BPMN_FILE}.update
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
        --subnode "//bpmn:serviceTask[@id='${CF_ID}' and @camunda:delegateExpression='\${syncCloudFunctionExecutorV2}']//camunda:inputParameter[@name='cloudSecrets']/camunda:list" \
        --type elem \
        --name camunda:value \
        --value "${SECRET}" \
       ${BPMN_FILE}
    fi
  done

done

echo "done"
