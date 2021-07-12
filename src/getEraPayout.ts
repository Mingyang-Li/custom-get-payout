import { ApiPromise, WsProvider } from '@polkadot/api';
import { EraRewardPoints, EraIndex } from '@polkadot/types/interfaces';
import { AnyNumber } from '@polkadot/types/types';

export async function getEraPayout(eraNumber: number) {
    // api initialisation
    const provider = new WsProvider('wss://kusama-rpc.polkadot.io/')
    const api = await ApiPromise.create({ provider});

    type validatorsType = {
        validatorId: string;
        rewardPoints: number,
        stakingPercentage: AnyNumber,
        amountRewarded: AnyNumber,
    }

    // get all rewards data
    const totalRewards = (await api.query.staking.erasRewardPoints<EraRewardPoints>(eraNumber));

    // get total reward points
    const totalRewardPoints = parseInt(totalRewards.total.toString());

    // get the $$$ amount staked
    const rewardAmount = await api.query.staking.erasValidatorReward(eraNumber);
    const totalRewardAmount = Number(rewardAmount.toString());
    // const totalStakingAmount = parseInt(strStakingAmount.slice(0, strStakingAmount.length-1));

    // calculate payout data and store 
    let validators: validatorsType[] = [];
    totalRewards.individual.forEach((value, key)=> {
        validators.push({
            validatorId: key.toString(),
            rewardPoints: parseInt(value.toString()),
            stakingPercentage: parseInt(value.toString()) / totalRewardPoints * 100,
            amountRewarded: (parseInt(value.toString()) / totalRewardPoints) * 100 * totalRewardAmount
        })
    })
    return { totalRewardPoints, validators, totalRewardAmount };
}