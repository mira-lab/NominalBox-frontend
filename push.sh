#!/usr/bin/env bash

ng build --prod
docker build -t chipbricks/angular-test:m3.2 .
docker push chipbricks/angular-test:m3.2
