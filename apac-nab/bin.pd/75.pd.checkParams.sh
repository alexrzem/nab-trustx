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


BPMN_FILE="../target.pd/${PD_NAME}.xml"

python3 ../bin.pd.tweaks/checkCfParams.py ${BPMN_FILE} ${BPMN_FILE}

echo "DONE"
# return to the initial directory
cd ${CURRENT_DIR}
