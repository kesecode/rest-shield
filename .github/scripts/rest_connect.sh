#!/bin/sh

#COVERAGE=`jq -r '.total.lines.pct' coverage-summary.json`
COVERAGE=98.9123
COVERAGE=$(echo ${COVERAGE%.*})

echo hallo hallo $COVERAGE

TOKEN=$(curl --location --request POST 'rest.kesecode.io/api/auth' --header 'Authorization: '$USER' '$PASSWORD'' | jq -r '.token')

curl --location --request POST 'rest.kesecode.io/api/post' --header 'Authorization: Bearer '$TOKEN'' --header 'JSON: {"coverage": '$COVERAGE'}'
