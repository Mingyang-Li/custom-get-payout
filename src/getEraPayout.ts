import { ApiPromise, WsProvider } from '@polkadot/api';
import { BlockHash } from '@polkadot/types/interfaces';

export async function getEraPayout(eraNumber: number, validatorId: string) {
    // api initialisation
    const provider = new WsProvider('wss://kusama-rpc.polkadot.io/')
    const api = await ApiPromise.create({ provider});

    // generating blockhash based on validator ID param
    const blockHash: BlockHash = await api.rpc.chain.getBlockHash(parseInt(validatorId));

    // Checking payouts from this particulat era
    // const allEraPayouts = await api.query.staking.erasStakers;
    const allEraPayouts: any= [{ payoutId: 1, isClaimed: false, claimedBy: "me" }]; // placeholder

    // Checking which payouts are claimed and unclaimed
    const payoutsByClaimedStatus = allEraPayouts.map((p: any) => {
        {
            p.payoutId,
            p.isClaimed,
            p // reference to originl payout data for future use
        }
    })

    // For all claimed payouts, find out who claimed them.
    const getClaimedPayoutsByClaimers = () => {
        let arr: any = [];
        payoutsByClaimedStatus.forEach((p: any) => {
            if (p.isClaimed) {
                arr = [
                    ...
                    [p.payoutId, p.claimedBy, p]
                ]
            }
        })
        return arr;
    }

    const claimedPayoutByClaimers = getClaimedPayoutsByClaimers();

    // For all payouts claimed by the system, find out which era did each payout happen within 

    return { allEraPayouts, payoutsByClaimedStatus, claimedPayoutByClaimers };
}