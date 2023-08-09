import { ApiPromise, Keyring, WsProvider } from '@polkadot/api';
import { cryptoWaitReady } from '@polkadot/util-crypto';

const main = async () => {
    await cryptoWaitReady();
    const keyring = new Keyring({ type: 'sr25519' });
    const submitter = keyring.addFromUri(
        process.env.SUBMITTER_SEED || '//Alice'
    );

    const ws = 'ws://127.0.0.1:9944';
    const wsProvider = new WsProvider(ws);
    const api = await ApiPromise.create({
        provider: wsProvider,
        noInitWarn: false,
    });

    const remark = await api.tx.system
        .remark('test')
        .signAndSend(submitter, ({ events = [], status, txHash }) => {
            console.log(`Current status is ${status.type}`);

            if (status.isInBlock) {
                console.log(
                    `Transaction included at blockHash ${status.asInBlock}`
                );
                console.log(`Transaction hash ${txHash.toHex()}`);

                // Loop through Vec<EventRecord> to display all events
                events.forEach(
                    ({ phase, event: { data, method, section } }) => {
                        console.log(
                            `\t' ${phase}: ${section}.${method}:: ${data}`
                        );
                    }
                );

                remark();
            }
        });
    console.log(api.genesisHash.toHex());
};

main().catch(console.error);
