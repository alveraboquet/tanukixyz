# Tanukixyz

![Node Shield](https://img.shields.io/badge/Node-%5E16.0.0-brightgreen?style=flat-square&logo=JavaScript)
![Typescript Shield](https://img.shields.io/badge/Typescript-%5E4.6.3-blue?style=flat-square&logo=TypeScript)
![Docker Build](https://img.shields.io/badge/Build-Docker-9cf?style=flat-square&logo=Docker)
![Database Mongo](https://img.shields.io/badge/Database-MongoDB-success?style=flat-square&logo=MongoDB)

This repo hosts all modules for [Tanukixyz](https://tanukixyz.com) backend services.
Tanuki is a blockchain and defi data and analytic platform. For more information, please refer to the [documentation](https://docs.tanukixyz.com/).

## Modules

| Name      | What does it do?                                                | Docs                                         |
|-----------|-----------------------------------------------------------------|----------------------------------------------|
| API       | Http rest API server serve all data queries on the platform     | [API Docs](https://docs.tanukixyz.com/)      |
| Indexer   | Index contract events from blockchains                          | [Documentation](https://docs.tanukixyz.com/) |
| Collector | Collect DeFi protocol metrics such liquidity, volume, fees, ... | [Documentation](https://docs.tanukixyz.com/) |

## Getting Start

```bash
# install dependencies
yarn

# build typescript
yarn compile

# get start
yarn start --help
```

## Data Sources

| Protocol                | Data Source              |
|-------------------------|--------------------------|
| Uniswap V3              | Subgraph                 |
| Uniswap V2 & Forks      | Subgraph                 |
| Compound & Forks        | On-chain contract events |
| AAVE v1, v2, v3 & Forks | On-chain contract events |
| Euler Finance           | Subgraph                 |
| Balancer v1, v2 & Forks | Subgraph                 |
| Alpaca Finance          | On-chain contract events |
| Abracadabra             | On-chain contract events |
| Convex Finance          | Subgraph                 |
| Curve Fi                | Curve API                |
| Dodoex                  | Dodo API                 |
| Liquity                 | On-chain contract events |
| Ribbon Finance          | Subgraph                 |
