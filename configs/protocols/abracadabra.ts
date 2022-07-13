import { GenesisBlocks } from '../constants/genesisBlocks';
import { getAbracadabraMarketConfig } from '../helpers';
import { EventIndexConfig, ProtocolConfig } from '../types';

export interface AbracadabraMarketConfig extends EventIndexConfig {}

export interface AbracadabraProtocolConfig extends ProtocolConfig {
  markets: Array<AbracadabraMarketConfig>;
}

export const AbracadabraConfigs: AbracadabraProtocolConfig = {
  name: 'abracadabra',
  tokenomics: {
    symbol: 'SPELL',
    coingeckoId: 'spell-token',
    chains: {
      ethereum: {
        decimals: 18,
        address: '',
      },
    },
  },
  markets: [
    // ethereum
    getAbracadabraMarketConfig('ethereum', '0x7ce7d9ed62b9a6c5ace1c6ec9aeb115fa3064757', GenesisBlocks['ethereum']),
    getAbracadabraMarketConfig('ethereum', '0x7b7473a76D6ae86CE19f7352A1E89F6C9dc39020', GenesisBlocks['ethereum']),
    getAbracadabraMarketConfig('ethereum', '0xf179fe36a36B32a4644587B8cdee7A23af98ed37', GenesisBlocks['ethereum']),
    getAbracadabraMarketConfig('ethereum', '0x05500e2Ee779329698DF35760bEdcAAC046e7C27', GenesisBlocks['ethereum']),
    getAbracadabraMarketConfig('ethereum', '0x003d5A75d284824Af736df51933be522DE9Eed0f', GenesisBlocks['ethereum']),
    getAbracadabraMarketConfig('ethereum', '0x98a84EfF6e008c5ed0289655CcdCa899bcb6B99F', GenesisBlocks['ethereum']),
    getAbracadabraMarketConfig('ethereum', '0xEBfDe87310dc22404d918058FAa4D56DC4E93f0A', GenesisBlocks['ethereum']),
    getAbracadabraMarketConfig('ethereum', '0x0BCa8ebcB26502b013493Bf8fE53aA2B1ED401C1', GenesisBlocks['ethereum']),
    getAbracadabraMarketConfig('ethereum', '0x920D9BD936Da4eAFb5E25c6bDC9f6CB528953F9f', GenesisBlocks['ethereum']),
    getAbracadabraMarketConfig('ethereum', '0x4EAeD76C3A388f4a841E9c765560BBe7B3E4B3A0', GenesisBlocks['ethereum']),
    getAbracadabraMarketConfig('ethereum', '0x252dCf1B621Cc53bc22C256255d2bE5C8c32EaE4', GenesisBlocks['ethereum']),
    getAbracadabraMarketConfig('ethereum', '0x35a0Dd182E4bCa59d5931eae13D0A2332fA30321', GenesisBlocks['ethereum']),
    getAbracadabraMarketConfig('ethereum', '0xc1879bf24917ebE531FbAA20b0D05Da027B592ce', GenesisBlocks['ethereum']),
    getAbracadabraMarketConfig('ethereum', '0x9617b633EF905860D919b88E1d9d9a6191795341', GenesisBlocks['ethereum']),
    getAbracadabraMarketConfig('ethereum', '0x257101F20cB7243E2c7129773eD5dBBcef8B34E0', GenesisBlocks['ethereum']),
    getAbracadabraMarketConfig('ethereum', '0x390Db10e65b5ab920C19149C919D970ad9d18A41', GenesisBlocks['ethereum']),
    getAbracadabraMarketConfig('ethereum', '0x5ec47EE69BEde0b6C2A2fC0D9d094dF16C192498', GenesisBlocks['ethereum']),
    getAbracadabraMarketConfig('ethereum', '0xd31E19A0574dBF09310c3B06f3416661B4Dc7324', GenesisBlocks['ethereum']),
    getAbracadabraMarketConfig('ethereum', '0xc6B2b3fE7c3D7a6f823D9106E22e66660709001e', GenesisBlocks['ethereum']),
    getAbracadabraMarketConfig('ethereum', '0x53375adD9D2dFE19398eD65BAaEFfe622760A9A6', GenesisBlocks['ethereum']),

    // fantom
    getAbracadabraMarketConfig('fantom', '0x7208d9F9398D7b02C5C22c334c2a7A3A98c0A45d', GenesisBlocks['fantom']),
    getAbracadabraMarketConfig('fantom', '0x4fdfFa59bf8dda3F4d5b38F260EAb8BFaC6d7bC1', GenesisBlocks['fantom']),
    getAbracadabraMarketConfig('fantom', '0x8E45Af6743422e488aFAcDad842cE75A09eaEd34', GenesisBlocks['fantom']),
    getAbracadabraMarketConfig('fantom', '0xd4357d43545F793101b592bACaB89943DC89d11b', GenesisBlocks['fantom']),
    getAbracadabraMarketConfig('fantom', '0xed745b045f9495B8bfC7b58eeA8E0d0597884e12', GenesisBlocks['fantom']),
    getAbracadabraMarketConfig('fantom', '0xa3Fc1B4b7f06c2391f7AD7D4795C1cD28A59917e', GenesisBlocks['fantom']),

    // avalanche
    getAbracadabraMarketConfig('avalanche', '0x3CFEd0439aB822530b1fFBd19536d897EF30D2a2', GenesisBlocks['avalanche']),
    getAbracadabraMarketConfig('avalanche', '0x3b63f81Ad1fc724E44330b4cf5b5B6e355AD964B', GenesisBlocks['avalanche']),
    getAbracadabraMarketConfig('avalanche', '0x95cCe62C3eCD9A33090bBf8a9eAC50b699B54210', GenesisBlocks['avalanche']),
    getAbracadabraMarketConfig('avalanche', '0x35fA7A723B3B39f15623Ff1Eb26D8701E7D6bB21', GenesisBlocks['avalanche']),
    getAbracadabraMarketConfig('avalanche', '0x0a1e6a80E93e62Bd0D3D3BFcF4c362C40FB1cF3D', GenesisBlocks['avalanche']),
    getAbracadabraMarketConfig('avalanche', '0x2450Bf8e625e98e14884355205af6F97E3E68d07', GenesisBlocks['avalanche']),
    getAbracadabraMarketConfig('avalanche', '0xAcc6821d0F368b02d223158F8aDA4824dA9f28E3', GenesisBlocks['avalanche']),

    // arbitrum
    getAbracadabraMarketConfig('arbitrum', '0xC89958B03A55B5de2221aCB25B58B89A000215E6', GenesisBlocks['arbitrum']),

    // binance
    getAbracadabraMarketConfig('binance', '0xF8049467F3A9D50176f4816b20cDdd9bB8a93319', GenesisBlocks['binance']),
    getAbracadabraMarketConfig('binance', '0x692CF15F80415D83E8c0e139cAbcDA67fcc12C90', GenesisBlocks['binance']),
  ],
};
