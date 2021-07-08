// Copyright 2017-2021 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { ApiPromise, WsProvider } from '@polkadot/api';
import type { DeriveEraPoints, DeriveEraRewards, DeriveStakerReward } from '@polkadot/api-derive/types';
import type { EraIndex, RewardDestination, Exposure, StakingLedger, ValidatorPrefs  } from '@polkadot/types/interfaces';
import { BN_ZERO } from '@polkadot/util';

interface State {
  allRewards?: Record<string, DeriveStakerReward[]> | null;
  isLoadingRewards: boolean;
  rewardCount: number;
}

interface ValidatorWithEras {
  eras: EraIndex[];
  stashId: string;
}

interface StakerState {
    controllerId: string | null;
    destination?: RewardDestination;
    exposure?: Exposure;
    hexSessionIdNext: string | null;
    hexSessionIdQueue: string | null;
    isLoading: boolean;
    isOwnController: boolean;
    isOwnStash: boolean;
    isStashNominating: boolean;
    isStashValidating: boolean;
    nominating?: string[];
    sessionIds: string[];
    stakingLedger?: StakingLedger;
    stashId: string;
    validatorPrefs?: ValidatorPrefs;
}

interface Filtered {
  filteredEras: EraIndex[];
  validatorEras: ValidatorWithEras[];
}

const EMPTY_FILTERED: Filtered = {
  filteredEras: [],
  validatorEras: []
};

const EMPTY_STATE: State = {
  isLoadingRewards: true,
  rewardCount: 0
};

function getRewards (
  [
    [stashIds], available
  ] : [
        [ string[] ], DeriveStakerReward[][]
      ]
  ): State {
  const allRewards: Record<string, DeriveStakerReward[]> = {};

  stashIds.forEach((stashId, index): void => {
    allRewards[stashId] = available[index].filter(({ eraReward }) => !eraReward.isZero());
  });

  return {
    allRewards,
    isLoadingRewards: false,
    rewardCount: Object.values(allRewards).filter((rewards) => rewards.length !== 0).length
  };
}

function getValRewards (api: ApiPromise, validatorEras: ValidatorWithEras[], erasPoints: DeriveEraPoints[], erasRewards: DeriveEraRewards[]): State {
  const allRewards: Record<string, DeriveStakerReward[]> = {};

  validatorEras.forEach(({ eras, stashId }): void => {
    eras.forEach((era): void => {
      const eraPoints = erasPoints.find((p) => p.era.eq(era));
      const eraRewards = erasRewards.find((r) => r.era.eq(era));

      if (eraPoints?.eraPoints.gt(BN_ZERO) && eraPoints?.validators[stashId] && eraRewards) {
        const reward = eraPoints.validators[stashId].mul(eraRewards.eraReward).div(eraPoints.eraPoints);

        if (!reward.isZero()) {
          const total = api.createType('Balance', reward);

          if (!allRewards[stashId]) {
            allRewards[stashId] = [];
          }

          allRewards[stashId].push({
            era,
            eraReward: eraRewards.eraReward,
            isEmpty: false,
            isValidator: true,
            nominating: [],
            validators: {
              [stashId]: {
                total,
                value: total
              }
            }
          });
        }
      }
    });
  });

  return {
    allRewards,
    isLoadingRewards: false,
    rewardCount: Object.values(allRewards).filter((rewards) => rewards.length !== 0).length
  };
}

export async function useOwnEraRewards (maxEras?: number, ownValidators?: StakerState[]): Promise<State> {
  // api initialisation
  const provider = new WsProvider(`wss://rpc.polkadot.io/`);
  const api = await ApiPromise.create({ provider});
  
  let state: any = {};
  let { filteredEras, validatorEras } = EMPTY_FILTERED;
  let filtered: any = {};
  
  // const mountedRef = useIsMountedRef(); // boolean
  const mountedRef = true;

  // const stashIds = useOwnStashIds(); // // replace hook by manual entry
  const stashIds = ["J9AG77fz7qgtYyySGgeHnJTsKrsUa5J6mrLandL7RyYUos7"];

  // const allEras = useCall<EraIndex[]>(api.derive.staking?.erasHistoric); // just use api.derive.staking?.erasHistoric to get all the eras
  const allEras = api.derive.staking?.erasHistoric;

  let stakerRewards: DeriveStakerReward[][];

  if (!ownValidators?.length && !!filteredEras.length && stashIds){
    stakerRewards = await api.derive.staking?.stakerRewardsMultiEras(
      stashIds, filteredEras,
    )
  }
  
  // const erasPoints = useCall<DeriveEraPoints[]>(
  //   !!validatorEras.length && !!filteredEras.length && api.derive.staking._erasPoints,
  //   [filteredEras, false]
  // );
  
  // const erasRewards = useCall<DeriveEraRewards[]>(
  //   !!validatorEras.length && !!filteredEras.length && api.derive.staking._erasRewards,
  //   [filteredEras, false]
  // );

  //first useeffect
  state = { allRewards: null, isLoadingRewards: true, rewardCount: 0 };

  // second useeffect
  if (allEras && maxEras) {
    const filteredEras = allEras.slice(-1 * maxEras);
    const validatorEras: ValidatorWithEras[] = [];

    if (allEras.length === 0) {
      state = {
        allRewards: {},
        isLoadingRewards: false,
        rewardCount: 0
      };
      filtered = { filteredEras, validatorEras };
    } else if (ownValidators?.length) {
      ownValidators.forEach(({ stakingLedger, stashId }): void => {
        if (stakingLedger) {
          const eras = filteredEras.filter((era) => !stakingLedger.claimedRewards.some((c) => era.eq(c)));

          if (eras.length) {
            validatorEras.push({ eras, stashId });
          }
        }
      });

      // When we have just claimed, we have filtered eras, but no validator eras - set accordingly
      if (filteredEras.length && !validatorEras.length) {
        state = {
          allRewards: {},
          isLoadingRewards: false,
          rewardCount: 0
        };
      }
    }
    filtered = { filteredEras, validatorEras };
  }

  //4th useeffect
  if (mountedRef && erasPoints && erasRewards && ownValidators) {
    state = getValRewards(api, validatorEras, erasPoints, erasRewards);
  }

  // return state;
  return state;
}
