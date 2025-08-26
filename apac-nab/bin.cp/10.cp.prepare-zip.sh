#!/bin/bash

# check arguments
if [ "$2" == "" ] ; then
  echo "usage: $0 <index file> <target CP name>"
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

rm -rf ../target.cp/${TARGET_NAME}
rm -rf ../target.cp/${TARGET_NAME}.*

mkdir -p ../target.cp/${TARGET_NAME}
cp -r ../src/assets ../target.cp/${TARGET_NAME}/assets
cp ../src/${INDEX_FILE} ../target.cp/${TARGET_NAME}/index.html
cd ../target.cp/${TARGET_NAME}

FILES=`find . -type f | sort`
for file in ${FILES} ; do
  MD5=`md5sum ${file} | awk '{print $1}'`
  echo -n "=${MD5}=${file}=" >> _.md5
done
MD5=`md5sum _.md5 | awk '{print $1}'`
echo -n "MD5=${MD5} - "
echo -n "${MD5}" > ../${TARGET_NAME}.md5

mkdir -p assets/md5
mv _.md5 assets/md5/${MD5}.html # this on works!


zip -r -9 ../${TARGET_NAME}.zip * >> ../${TARGET_NAME}.log
#echo "DONE"

# return to the initial directory
cd ${CURRENT_DIR}
