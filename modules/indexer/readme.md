# Contract Events Indexer

This module collects events from smart contract and write to database

## Get Started

```bash
yarn && yarn build

# start collect event from all configs
yarn start indexer

## start collect event from given config, ex: compound
yarn start indexer --project compound
```

## Configurations

1. Please check [compound.finance protocol](./configs/compound.ts) example config
2. Make sure you [export new configs](./constants.ts)
