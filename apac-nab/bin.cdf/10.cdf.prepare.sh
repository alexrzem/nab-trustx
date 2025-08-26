#!/bin/bash

# check arguments
if [ "$2" == "" ] ; then
  echo "usage: $0 <index file> <target CDF name>"
  exit
fi
# assign variables
INDEX_FILE=$1
TARGET_NAME=$2

# change dir
CURRENT_DIR=`pwd`
cd `dirname $0`

# actual scripting
echo ""
echo -n "${INDEX_FILE} -> ${TARGET_NAME} - "

mkdir -p ../target.cdf
#rm -rf ../target.cdf/${TARGET_NAME}*


cat ../src.cdf/${INDEX_FILE} | python3 -m json.tool > ../target.cdf/${TARGET_NAME}.json
MD5=`cat ../target.cdf/${TARGET_NAME}.json | python3 -m json.tool | md5sum  | awk '{print $1}'`
echo -n "MD5=${MD5} - "
echo -n ${MD5} > ../target.cdf/${TARGET_NAME}.md5

#echo "DONE"

# return to the initial directory
cd ${CURRENT_DIR}
