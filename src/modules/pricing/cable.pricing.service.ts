import { Injectable } from '@nestjs/common';
import { CablePlan } from '../plans/plans.dto';
import { firestore } from 'src/config/firebase.config';

@Injectable()
export class CablePricingService {
  private pricingCache: Map<string, number> | null = null;
  private loadingPromise: Promise<Map<string, number>> | null = null;
  private lastFetch = 0;
  private cacheVersion = 0;

  async onModuleInit() {
    this.pricingCache = await this.getAllPlanPrices();
    this.lastFetch = Date.now();
  }

  getCableRef(cablePlan: CablePlan) {
    return firestore
      .collection('cable')
      .doc(`${cablePlan.package}${cablePlan.id}`);
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
    const snapshot = await firestore.collection('cable').get();

    const map = new Map<string, number>();

    snapshot.forEach((doc) => {
      const data = doc.data();
      const price = Number(data.price);

      if (!price || isNaN(price)) return;

      const key = `${data.plan_id}_${data.cable}`;
      map.set(key, price);
    });

    return map;
  }

  async saveCablePlanToFirestore(plan: CablePlan, price: number) {
    const planRef = this.getCableRef(plan);

    await planRef.set({
      plan_id: plan.id,
      cable: plan.cable,

      price,
    });
  }

  async updatePrice(plan: CablePlan, price: number) {
    const planRef = this.getCableRef(plan);

    await planRef.set(
      {
        plan_id: plan.id,
        cable: plan.cable,
        price,
      },
      { merge: true },
    );

    this.cacheVersion++;
    this.pricingCache = null;
  }
}
