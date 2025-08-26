#!/bin/bash

# check arguments
if [ "$2" == "" ] ; then
  echo "usage: $0 <PD file name> <m5 file name>"
  exit
fi

# assign variables
PD_FILE_NAME=$1
MD5_FILE_NAME=$2

# change dir
CURRENT_DIR=`pwd`
cd `dirname $0`


# actual scripting
. ../settings.sh
echo -n "comparing - "
MD5=`cat ${PD_FILE_NAME} | \
  python3 -c "import sys,re; s=sys.stdin.read(); s=re.sub('[\r\n\t ]+', '', s); print(s);" | \
  python3 -c "import hashlib,sys;print(hashlib.md5(sys.stdin.buffer.read()).hexdigest(),end='')"`

echo -n ${MD5} > ${MD5_FILE_NAME}

# ${BPMN_FILE}.server
# ${BPMN_FILE}


#echo "DONE"
# return to the initial directory
cd ${CURRENT_DIR}
