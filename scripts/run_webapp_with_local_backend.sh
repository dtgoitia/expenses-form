#!/usr/bin/env bash

echo "Overriding environment variables to use local backend..."

export REACT_APP_API_BASE_URL="http://0.0.0.0:8080/v1"
export HASURA_GRAPHQL_ADMIN_SECRET="myadminsecretkey"


docker-compose up hasura_graphql_engine expenses-webapp
