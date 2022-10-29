#!/bin/bash
table_name=teams
endpoint_url=http://dynamodb:8000
test_team=test
test_token=test123

table_info=$(aws dynamodb describe-table --table-name $table_name --endpoint-url $endpoint_url)

if [ $? -eq 0 ]; then
  echo "Table $table_name already exists"
else
  echo "Table $table_name does not exist, creating..."
  aws dynamodb create-table \
   --table-name teams \
   --attribute-definitions AttributeName=name,AttributeType=S \
   --key-schema AttributeName=name,KeyType=HASH \
   --billing-mode PAY_PER_REQUEST \
   --endpoint-url $endpoint_url
fi

item_exists=$(aws dynamodb get-item --table-name $table_name --key '{"name": {"S": "'$test_team'"}}' --query 'Item.token' --output text --endpoint-url $endpoint_url)

if [ "$item_exists" == "None" ]; then
  echo "Test team $test_team does not exist, creating..."
  aws dynamodb put-item --table-name $table_name --item '{"name": {"S": "'$test_team'"}, "tokens": {"L": [{"S": "'$test_token'"}]}}' --endpoint-url $endpoint_url
else
  echo "Test team $test_team already exists"
fi