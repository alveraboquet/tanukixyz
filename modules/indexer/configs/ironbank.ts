import { getCompoundPoolTokenIndexConfig } from '../helpers';
import { IndexConfig } from '../types';

const EthSyncFromBlock = 13910000; // Dec-31-2021 12:53:50 AM +UTC
const AvaxSyncFromBlock = 8909901; // Dec-30-2021 12:13:54 PM +UTC
const FtmSyncFromBlock = 26217461; // Dec-27-2021 06:50:11 PM +UTC

const IronBankConfigs: Array<IndexConfig> = [
  // ethereum
  getCompoundPoolTokenIndexConfig('ethereum', '0x226f3738238932ba0db2319a8117d9555446102f', EthSyncFromBlock), // SUSHI
  getCompoundPoolTokenIndexConfig('ethereum', '0x48759f220ed983db51fa7a8c0d2aab8f3ce4166a', EthSyncFromBlock), // USDT
  getCompoundPoolTokenIndexConfig('ethereum', '0x8e595470ed749b85c6f7669de83eae304c2ec68f', EthSyncFromBlock), // DAI
  getCompoundPoolTokenIndexConfig('ethereum', '0x76eb2fe28b36b3ee97f3adae0c69606eedb2a37c', EthSyncFromBlock), // USDC
  getCompoundPoolTokenIndexConfig('ethereum', '0x41c84c0e2ee0b740cf0d31f63f3b6f627dc6b393', EthSyncFromBlock), // WETH
  getCompoundPoolTokenIndexConfig('ethereum', '0x7736ffb07104c0c400bb0cc9a7c228452a732992', EthSyncFromBlock), // DPI
  getCompoundPoolTokenIndexConfig('ethereum', '0xb8c5af54bbdcc61453144cf472a9276ae36109f9', EthSyncFromBlock), // CRV
  getCompoundPoolTokenIndexConfig('ethereum', '0x30190a3b52b5ab1daf70d46d72536f5171f22340', EthSyncFromBlock), // AAVE
  getCompoundPoolTokenIndexConfig('ethereum', '0x8fc8bfd80d6a9f17fb98a373023d72531792b431', EthSyncFromBlock), // WBTC
  getCompoundPoolTokenIndexConfig('ethereum', '0xfeeb92386a055e2ef7c2b598c872a4047a7db59f', EthSyncFromBlock), // UNI
  getCompoundPoolTokenIndexConfig('ethereum', '0xe7bff2da8a2f619c2586fb83938fa56ce803aa16', EthSyncFromBlock), // LINK
  getCompoundPoolTokenIndexConfig('ethereum', '0x12a9cc33a980daa74e00cc2d1a0e74c57a93d12c', EthSyncFromBlock), // SNX
  getCompoundPoolTokenIndexConfig('ethereum', '0xfa3472f7319477c9bfecdd66e4b948569e7621b9', EthSyncFromBlock), // YFI
  getCompoundPoolTokenIndexConfig('ethereum', '0xe0b57feed45e7d908f2d0dacd26f113cf26715bf', EthSyncFromBlock), // CVX
  getCompoundPoolTokenIndexConfig('ethereum', '0xa8caea564811af0e92b1e044f3edd18fa9a73e4f', EthSyncFromBlock), // EURS
  getCompoundPoolTokenIndexConfig('ethereum', '0x9d029cd7cedcb194e2c361948f279f1788135bb2', EthSyncFromBlock), // CREAM
  getCompoundPoolTokenIndexConfig('ethereum', '0x09bdcce2593f0bef0991188c25fb744897b6572d', EthSyncFromBlock), // BUSD
  getCompoundPoolTokenIndexConfig('ethereum', '0x297d4da727fbc629252845e96538fc46167e453a', EthSyncFromBlock), // DUSD
  getCompoundPoolTokenIndexConfig('ethereum', '0xbddeb563e90f6cbf168a7cda4927806477e5b6c6', EthSyncFromBlock), // USDP
  getCompoundPoolTokenIndexConfig('ethereum', '0x27260eeb2a6c382a6e7d14b8991892790ca929bb', EthSyncFromBlock), // EURT
  getCompoundPoolTokenIndexConfig('ethereum', '0xa0e5a19e091bbe241e655997e50da82da676b083', EthSyncFromBlock), // GUSD
  getCompoundPoolTokenIndexConfig('ethereum', '0x9925f2f869048934e62720120798e7cce7e777bb', EthSyncFromBlock), // FRAX
  getCompoundPoolTokenIndexConfig('ethereum', '0xd2b0d3594427e0c57c39e3455e2fb2dfed1e0b99', EthSyncFromBlock), // APE

  // avalanche
  getCompoundPoolTokenIndexConfig('avalanche', '0xb3c68d69E95B095ab4b33B4cB67dBc0fbF3Edf56', AvaxSyncFromBlock), // WAVAX
  getCompoundPoolTokenIndexConfig('avalanche', '0x338EEE1F7B89CE6272f302bDC4b952C13b221f1d', AvaxSyncFromBlock), // WETH.e
  getCompoundPoolTokenIndexConfig('avalanche', '0xCEb1cE674f38398432d20bc8f90345E91Ef46fd3', AvaxSyncFromBlock), // USDT.e
  getCompoundPoolTokenIndexConfig('avalanche', '0xa124B7514217e06F88FFa833e37289E397C5cC6B', AvaxSyncFromBlock), // USDT
  getCompoundPoolTokenIndexConfig('avalanche', '0xe28965073C49a02923882B8329D3E8C1D805E832', AvaxSyncFromBlock), // USDC.e
  getCompoundPoolTokenIndexConfig('avalanche', '0xEc5Aa19566Aa442C8C50f3C6734b6Bb23fF21CD7', AvaxSyncFromBlock), // USDC
  getCompoundPoolTokenIndexConfig('avalanche', '0x085682716f61a72bf8C573FBaF88CCA68c60E99B', AvaxSyncFromBlock), // DAI.e
  getCompoundPoolTokenIndexConfig('avalanche', '0xB09b75916C5F4097C8b5812E63e216FEF97661Fc', AvaxSyncFromBlock), // WBTC.e
  getCompoundPoolTokenIndexConfig('avalanche', '0x18931772Adb90e7f214B6CbC78DdD6E0F090D4B1', AvaxSyncFromBlock), // LINK.e
  getCompoundPoolTokenIndexConfig('avalanche', '0xbf1430d9eC170b7E97223C7F321782471C587b29', AvaxSyncFromBlock), // MIM
  getCompoundPoolTokenIndexConfig('avalanche', '0x02C9133627a14214879175a7A222d0a7f7404eFb', AvaxSyncFromBlock), // ALPHA.e
  getCompoundPoolTokenIndexConfig('avalanche', '0x9be7B5b7e219461F164863daD045a35D1101aa64', AvaxSyncFromBlock), // UST
  getCompoundPoolTokenIndexConfig('avalanche', '0xb1f656B82507cd07daBD71f966294E2262B465AD', AvaxSyncFromBlock), // UST.e

  // fantom
  getCompoundPoolTokenIndexConfig('fantom', '0xd528697008aC67A21818751A5e3c58C8daE54696', FtmSyncFromBlock), // WFTM
  getCompoundPoolTokenIndexConfig('fantom', '0xcc3E89fBc10e155F1164f8c9Cf0703aCDe53f6Fd', FtmSyncFromBlock), // WETH
  getCompoundPoolTokenIndexConfig('fantom', '0x20CA53E2395FA571798623F1cFBD11Fe2C114c24', FtmSyncFromBlock), // WBTC
  getCompoundPoolTokenIndexConfig('fantom', '0x04c762a5dF2Fa02FE868F25359E0C259fB811CfE', FtmSyncFromBlock), // DAI
  getCompoundPoolTokenIndexConfig('fantom', '0x328A7b4d538A2b3942653a9983fdA3C12c571141', FtmSyncFromBlock), // USDC
  getCompoundPoolTokenIndexConfig('fantom', '0x0980f2F0D2af35eF2c4521b2342D59db575303F7', FtmSyncFromBlock), // YFI
  getCompoundPoolTokenIndexConfig('fantom', '0xB1FD648D8CA4bE22445963554b85AbbFC210BC83', FtmSyncFromBlock), // SUSHI
  getCompoundPoolTokenIndexConfig('fantom', '0x79EA17bEE0a8dcb900737E8CAa247c8358A5dfa1', FtmSyncFromBlock), // AAVE
  getCompoundPoolTokenIndexConfig('fantom', '0x4eCEDdF62277eD78623f9A94995c680f8fd6C00e', FtmSyncFromBlock), // LINK
  getCompoundPoolTokenIndexConfig('fantom', '0x1cc6Cf8455f7783980B1ee06ecD4ED9acd94e1c7', FtmSyncFromBlock), // SNX
  getCompoundPoolTokenIndexConfig('fantom', '0x70faC71debfD67394D1278D98A29dea79DC6E57A', FtmSyncFromBlock), // fUSDT
  getCompoundPoolTokenIndexConfig('fantom', '0x46F298D5bB6389ccb6C1366bB0C8a30892CA2f7C', FtmSyncFromBlock), // MIM
  getCompoundPoolTokenIndexConfig('fantom', '0x2919Ec3e7B35fB0C8597A5f806fb1f59c540EAb4', FtmSyncFromBlock), // FRAX
  getCompoundPoolTokenIndexConfig('fantom', '0x28192abdB1D6079767aB3730051c7f9Ded06FE46', FtmSyncFromBlock), // TUSD
  getCompoundPoolTokenIndexConfig('fantom', '0xf13252c1044aa83b910c77322e67387e187f64ca', FtmSyncFromBlock), // UST
];

export default IronBankConfigs;
