#!/bin/bash
# Deploy to staging/production on master/release merges (not PRs)

set -e

# Don't deploy on PRs
if [ "$TRAVIS_PULL_REQUEST" != "false" ]; then
  exit 0
fi

if [ "$TRAVIS_BRANCH" == "master" ]; then
  # Deploy to staging on a merge to master
  ember build -e staging
  ember deploy:assets -e staging
elif [ "$TRAVIS_BRANCH" == "release" ]; then
  # Deploy to production on a merge to release
  ember build -e production
  ember deploy:assets -e production
fi
