import { ApiPromise, WsProvider } from '@polkadot/api';
import { EraRewardPoints, AccountId } from '@polkadot/types/interfaces';
import { AnyNumber } from '@polkadot/types/types';
import { type } from 'os';
import { parse } from 'path';

export async function getEraPayout(eraNumber: number) {
    // api initialisation
    const provider = new WsProvider('wss://kusama-rpc.polkadot.io/')
    const api = await ApiPromise.create({ provider});

    type validatorsType = {
        validatorId: string;
        rewardPoints: number,
        stakingPercentage: AnyNumber
    }

    // get total rewards
    const totalRewards = (await api.query.staking.erasRewardPoints<EraRewardPoints>(eraNumber));

    // get the $$$ amount staked
    const stakingAmount = await api.query.staking.erasTotalStake(eraNumber)
    const strStakingAmount = stakingAmount.toBigInt().toString();
    const totalStakingAmount = parseInt(strStakingAmount.slice(0, strStakingAmount.length-1));

    // calculate payout data and store 
    let validators: validatorsType[] = [];
    totalRewards.individual.forEach((value, key)=> {
        // console.log(`account: ${key}, reward points: ${value.toString()}`)
        validators.push({
            validatorId: key.toString(),
            rewardPoints: parseInt(value.toString()),
            stakingPercentage: parseInt(value.toString()) / totalStakingAmount * 100
        })
    })

    return { validators, totalStakingAmount };
}