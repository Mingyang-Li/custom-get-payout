import { ApiPromise, WsProvider } from '@polkadot/api';
import { EraRewardPoints } from '@polkadot/types/interfaces';

export async function getEraPayout(eraNumber: number) {
    // api initialisation
    const provider = new WsProvider('wss://kusama-rpc.polkadot.io/')
    const api = await ApiPromise.create({ provider});

    const totalRewards = (await api.query.staking.erasRewardPoints<EraRewardPoints>(eraNumber)).toHuman();
    const totalStakingAmount = (await api.query.staking.erasTotalStake(eraNumber)).toBigInt();
    return { totalRewards, totalStakingAmount };
}