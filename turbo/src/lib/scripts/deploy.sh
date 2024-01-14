#!/bin/sh
. src/lib/scripts/colors.sh

./src/lib/scripts/prepare.sh

npm run test

TEST_EXIT_CODE=$?
if [ $TEST_EXIT_CODE -ne 0 ]; then
    echo "Errors running tests."
    echo "Refusing to deploy."
    exit $TEST_EXIT_CODE
fi

firebase deploy "$@"