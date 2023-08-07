import { ApiPromise, WsProvider } from '@polkadot/api';

const main = async () => {
    const ws = 'wss://rpc.devnet.subspace.network/ws';
    const wsProvider = new WsProvider(ws);
    const api = await ApiPromise.create({ provider: wsProvider });

    console.log(api.genesisHash.toHex());
};

main().catch(console.error);
