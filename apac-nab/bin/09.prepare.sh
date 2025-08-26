
# change dir
CURRENT_DIR=`pwd`
cd `dirname $0`

./90.createApiToken.sh

cd ..

rm -rf target target.pd target.cp target.cdf

cd ${CURRENT_DIR}
