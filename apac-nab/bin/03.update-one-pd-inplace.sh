#!/bin/bash

# check for first arg
if [ "$1" == "" ] ; then
  echo "usage: $0 <process definition name>"
  echo "if env variable 'UPDATE_CFS' is set to 'true' then all CFs would be updated to have standard set of pvariables and secrets"
  echo "if env variable 'TRUSTX_CF_VERSIONING' is set to 'true' then all CFs versions would be updated to the latest present in the system"
  exit
fi
PD_NAME=$1

# function definition
update1() {
  local PD_NAME=$1
  echo ""
  ../bin.pd/10.pd.read-latest.sh ${PD_NAME}
  ../bin.pd/20.pd.extract-cp-versions.sh ${PD_NAME}
  ../bin.pd/25.pd.update-all-cp-versions.sh ${PD_NAME}

  if [ "${UPDATE_CFS}" == "true" ] ; then
    ../bin.pd/30.pd.check-pv.sh ${PD_NAME}
    ../bin.pd/35.pd.check-secrets.sh ${PD_NAME}
  fi

  if [ "${TRUSTX_CF_VERSIONING}" == "true" ] ; then
    ../bin.pd/40.pd.extract-cf-versions.sh ${PD_NAME}
    ../bin.pd/45.pd.update-all-cf-versions.sh ${PD_NAME}
  fi


  ../bin.pd/50.pd.extract-cdf-versions.sh ${PD_NAME}
  ../bin.pd/55.pd.update-all-cdf-versions.sh ${PD_NAME}
  ../bin.pd/70.pd.pick-latest-theme.sh ${PD_NAME}
  ../bin.pd/90.pd.upload2.sh ${PD_NAME}
}




# change dir
CURRENT_DIR=`pwd`
cd `dirname $0`

echo "== Update PD '${PD_NAME}' =="

./09.prepare.sh

update1 ${PD_NAME}

# return to the initial directory
cd ${CURRENT_DIR}
