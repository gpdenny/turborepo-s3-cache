#! /bin/bash
docker-compose up -d
yarn sls offline --stage ci &

until $(curl --output /dev/null --silent --head http://localhost:3000); do
    printf '.'
    sleep 5
done

yarn jest --config=jest.config.cjs \
--coverage --coverageReporters=json-summary \
--coverageReporters=text | tee ./coverage.txt

ps aux | grep -ie "sls.*offline" | grep -v grep | awk '{print $2}' | xargs kill -9
docker-compose down --remove-orphans