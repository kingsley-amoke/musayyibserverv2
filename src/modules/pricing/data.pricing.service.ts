import { Injectable } from '@nestjs/common';
import { CablePlan, DataPlan } from '../plans/plans.dto';
import { firestore } from '../../config/firebase.config';
import { PricingHelper } from './pricing.helper';

@Injectable()
export class PricingService {
  private pricingCache: Map<string, number> | null = null;
  private loadingPromise: Promise<Map<string, number>> | null = null;
  private lastFetch = 0;
  private cacheVersion = 0;

  async onModuleInit() {
    this.pricingCache = await this.getAllPlanPrices();
    this.lastFetch = Date.now();
  }

  getPlanRef(plan: DataPlan) {
    return firestore.collection('plans').doc(`${plan.network_id}_${plan.id}`);
  }

  async getPricingCached() {
    const now = Date.now();

    if (this.pricingCache && now - this.lastFetch < 30000) {
      return this.pricingCache;
    }

    if (this.loadingPromise) {
      return this.loadingPromise;
    }

    this.loadingPromise = this.getAllPlanPrices();

    this.pricingCache = await this.loadingPromise;
    this.lastFetch = now;

    this.loadingPromise = null;

    return this.pricingCache;
  }

  async getAllPlanPrices() {
    const snapshot = await firestore.collection('plans').get();

    const map = new Map<string, number>();

    snapshot.forEach((doc) => {
      const data = doc.data();
      const price = Number(data.price);

      if (!price || isNaN(price)) return;

      const key = `${data.network_id}_${data.plan_id}`;
      map.set(key, price);
    });

    return map;
  }

  async saveDataPlanToFirestore(plan: DataPlan, price: number) {
    const planRef = this.getPlanRef(plan);

    await planRef.set({
      network_id: plan.network_id,
      plan_id: plan.id,
      price,
    });
  }

  async updatePrice(plan: DataPlan, price: number): Promise<DataPlan> {
    const planRef = this.getPlanRef(plan);

    await planRef.set(
      {
        network_id: plan.network_id,
        plan_id: plan.id,
        price,
      },
      { merge: true },
    );

    this.cacheVersion++;
    this.pricingCache = null;
    return {
      ...plan,
      price,
    };
  }
}
