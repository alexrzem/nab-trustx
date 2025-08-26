#!/bin/bash
#exit
CURRENT_DIR=`pwd`
cd `dirname $0`

./09.prepare.sh
./30.pd.upload-from-git.sh

cd ${CURRENT_DIR}
