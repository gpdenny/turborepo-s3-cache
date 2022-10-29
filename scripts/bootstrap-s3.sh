#! /bin/bash
bucket_name=cache
endpoint_url=http://minio:9000

mc config host add myminio http://minio:9000 minio minio123
bucket_info=$(mc ls myminio/cache)

if [ $? -eq 0 ]; then
  echo "Bucket $bucket_name already exists"
else
  echo "Bucket $bucket_name does not exist, creating..."
    mc mb myminio/cache --ignore-existing
    mc policy set readwrite myminio/cache
fi