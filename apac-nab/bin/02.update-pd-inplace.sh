#!/bin/bash

CURRENT_DIR=`pwd`
cd `dirname $0`

./09.prepare.sh
./30.pd.update-all-inplace.sh

cd ${CURRENT_DIR}
