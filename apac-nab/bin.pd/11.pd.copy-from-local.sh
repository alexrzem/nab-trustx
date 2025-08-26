#!/bin/bash

# check arguments
if [ "$1" == "" ] ; then
  echo "usage: $0 <PD name>"
  exit
fi

# assign variables
PD_NAME=$1

BPMN_FILE="../target.pd/${PD_NAME}.xml"

# change dir
CURRENT_DIR=`pwd`
cd `dirname $0`

echo -n "${PD_NAME} - "

cp ../src.pd/${PD_NAME}.bpmn ${BPMN_FILE}
echo "git update" > ${BPMN_FILE}.update
echo "COPIED"
ls -la ${BPMN_FILE}*

cd ${CURRENT_DIR}
