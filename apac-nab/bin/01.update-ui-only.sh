#!/bin/bash

CURRENT_DIR=`pwd`
cd `dirname $0`

./09.prepare.sh
./10.cp.update-all.sh
./20.cdf.update-all.sh

cd ${CURRENT_DIR}
