import { Injectable } from '@nestjs/common';
import { allPlans, network } from './plans.data';
import { CablePlan, DataPlan } from './plans.dto';
import { PricingService } from '../pricing/data.pricing.service';
import { CustomError } from '../../common/utils/custom-error.utils';
import { cablePlans, cables } from './cable.plans';
import { electricity } from './electricity.plans';
import { exams } from './exams.plans';
import { CablePricingService } from '../pricing/cable.pricing.service';
import { mtnPlans } from './mtn.plans';
import { gloPlans } from './glo.plans';
import { airtelPlans } from './airtel.plans';
import { etisalatPlans } from './etisalat.plans';

@Injectable()
export class PlansService {
  constructor(
    private dataPricing: PricingService,
    private cablePricing: CablePricingService,
  ) {}
  private plans = allPlans;

  getNetworks() {
    return network;
  }

  getCables() {
    return cables;
  }

  getElectricity() {
    return electricity;
  }

  getExams() {
    return exams;
  }

  getPlanTypes(networkId: number): Array<string> {
    return [
      ...new Set(
        this.plans
          .filter((p) => p.network_id === networkId)
          .map((p) => p.plan_type.toUpperCase()),
      ),
    ];
  }

  async getCablePlans(cable: string): Promise<Array<CablePlan>> {
    let plans: Array<CablePlan> = [];

    if (!cable) {
      plans = cablePlans;
    } else {
      plans = cablePlans.filter(
        (p) => p.cable.toLowerCase() === cable.toLowerCase(),
      );
    }

    const pricingMap = await this.cablePricing.getPricingCached();

    return plans.map((p) => {
      const key = `${p.id}_${p.cable}`;
      const overridePrice = pricingMap.get(key);

      return {
        ...p,
        price: overridePrice ?? p.price ?? 0,
      };
    });
  }

  async getPlans(networkId: number, type: string) {
    let plans: Array<DataPlan> = [];

    if (!networkId) {
      plans = allPlans;
    } else if (!type) {
      switch (networkId) {
        case 1:
          plans = mtnPlans;
          break;
        case 2:
          plans = gloPlans;
          break;
        case 3:
          plans = etisalatPlans;
          break;
        case 4:
          plans = airtelPlans;
          break;
      }
    } else {
      plans = this.plans.filter(
        (p) =>
          p.network_id === networkId &&
          p.plan_type.toLowerCase() === type.toLowerCase(),
      );
    }

    const pricingMap = await this.dataPricing.getPricingCached();

    return plans.map((p) => {
      const key = `${p.network_id}_${p.id}`;
      const overridePrice = pricingMap.get(key);

      return {
        ...p,
        price: overridePrice ?? p.price ?? 0,
      };
    });
  }

  async getPlanById(plan_id: number) {
    const plan = this.plans.find((p) => p.id === plan_id);

    if (!plan) throw CustomError.notFoundError('Data plan does not exist');

    const pricingMap = await this.dataPricing.getPricingCached();

    const key = `${plan.network_id}_${plan.id}`;
    const overridePrice = pricingMap.get(key);

    return {
      ...plan,
      price: overridePrice ?? plan.price ?? 0,
    };
  }

  async findAndUpdatePrice(network_id: number, plan_id: number, price: number) {
    const plan: DataPlan | undefined = this.plans.find(
      (p) => p.network_id === network_id && p.id === plan_id,
    );

    if (!plan) throw CustomError.notFoundError('Data plan does not exist');

    return await this.dataPricing.updatePrice(plan, price);
  }

  async findAndUpdateCablePrice(planId: number, cable: string, price: number) {
    const plan: CablePlan | undefined = cablePlans.find(
      (p) => p.id === planId && p.cable.toLowerCase() === cable.toLowerCase(),
    );

    if (!plan) throw CustomError.notFoundError('Cable plan does not exist');

    return await this.cablePricing.updatePrice(plan, price);
  }

  // getAndFormatDataPlan(plans): Array<DataPlan> {
  //   console.log('Initial length is:' + plans.length);
  //   const ids = new Set();
  //   const newPlans: Array<DataPlan> = plans
  //     .filter((p) => {
  //       if (ids.has(p.id)) {
  //         return false;
  //       } else {
  //         ids.add(p.id);
  //         return true;
  //       }
  //     })
  //     .sort((a, b) => a.id - b.id)
  //     .map((p) => {
  //       return {
  //         id: p.id,
  //         dataplan_id: p.dataplan_id,
  //         network_id: p.network,
  //         plan_type: p.plan_type,
  //         validity_unit: 'day',
  //         validity_value: 30,
  //         name: p.plan,
  //       };
  //     });

  //   console.log('New length is:' + newPlans.length);
  //   return newPlans;
  // }
}
