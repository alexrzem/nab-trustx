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


BPMN_FILE="../target.pd/${PD_NAME}.xml"


# ${BPMN_FILE}.server
# ${BPMN_FILE}

# read md5 for both files

./81.pd.read-md5.sh ${BPMN_FILE} ${BPMN_FILE}.md5
./81.pd.read-md5.sh ${BPMN_FILE}.server ${BPMN_FILE}.server.md5
MD5=`cat ${BPMN_FILE}.md5`
SERVER_MD5=`cat ${BPMN_FILE}.server.md5`

# compare
if [ "${MD5}" == "${SERVER_MD5}" ] ; then
# if match - remove .update file
  rm -f ${BPMN_FILE}.update
  echo -n "match to server - "
else
# if not match - create .update file
  echo "different-${MD5}-${SERVER_MD5}-" > ${BPMN_FILE}.update
  echo -n "different-${MD5}-${SERVER_MD5}-"
fi




echo "DONE"
# return to the initial directory
cd ${CURRENT_DIR}
