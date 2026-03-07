import { Injectable } from '@nestjs/common';
import { firestore } from '../../config/firebase.config';
import { AnalyticsSummary, AnalyticsTransaction } from './analytics.dto';

@Injectable()
export class AnalyticsService {
  private transactionsRef = firestore.collection('analytics_transactions');
  private summaryRef = firestore.collection('analytics_summary');

  /**
   * 🔥 Add Transaction + Update Summary (Atomic)
   */
  async recordTransaction(data: {
    type: 'inflow' | 'outflow';
    amount: number;
    profit?: number;
  }) {
    const now = new Date();
    const day = now.toISOString().split('T')[0];

    const transaction: AnalyticsTransaction = {
      type: data.type,
      amount: data.amount,
      profit: data.profit || 0,
      date: now.toISOString(),
      day,
    };

    const summaryDoc = this.summaryRef.doc(day);

    await firestore.runTransaction(async (trx) => {
      /// 1. Save transaction
      trx.set(this.transactionsRef.doc(), transaction);

      /// 2. Get current summary
      const summarySnap = await trx.get(summaryDoc);

      let summary: AnalyticsSummary;

      if (!summarySnap.exists) {
        summary = {
          date: day,
          totalInflow: 0,
          totalOutflow: 0,
          totalProfit: 0,
        };
      } else {
        summary = summarySnap.data() as AnalyticsSummary;
      }

      /// 3. Update values
      if (data.type === 'inflow') {
        summary.totalInflow += data.amount;
      } else {
        summary.totalOutflow += data.amount;
        summary.totalProfit += data.profit || 0;
      }

      /// 4. Save updated summary
      trx.set(summaryDoc, summary);
    });
  }

  /**
   * 📥 Record Deposit (Monnify)
   */
  async recordInflow(amount: number) {
    return this.recordTransaction({
      type: 'inflow',
      amount,
      profit: 0,
    });
  }

  /**
   * 📤 Record Purchase (VTU)
   */
  async recordOutflow(amount: number, profit: number) {
    return this.recordTransaction({
      type: 'outflow',
      amount,
      profit,
    });
  }

  /**
   * 📊 Get Dashboard Stats
   */
  async getDashboardStats() {
    const snapshot = await this.summaryRef.get();

    let totalInflow = 0;
    let totalOutflow = 0;
    let totalProfit = 0;
    let todayProfit = 0;

    const today = new Date().toISOString().split('T')[0];

    snapshot.forEach((doc) => {
      const data = doc.data() as AnalyticsSummary;

      totalInflow += data.totalInflow;
      totalOutflow += data.totalOutflow;
      totalProfit += data.totalProfit;

      if (data.date === today) {
        todayProfit = data.totalProfit;
      }
    });

    return {
      totalRevenue: totalInflow,
      totalOutflow,
      totalProfit,
      todayProfit,
    };
  }

  /**
   * 📈 Get Chart Data (Last N Days)
   */
  async getChartData(days = 7) {
    const snapshot = await this.summaryRef
      .orderBy('date', 'desc')
      .limit(days)
      .get();

    const data: Array<any> = [];

    snapshot.forEach((doc) => {
      const d = doc.data() as AnalyticsSummary;

      data.push({
        date: d.date,
        revenue: d.totalInflow,
        profit: d.totalProfit,
      });
    });

    return data.reverse(); // oldest → newest
  }

  /**
   * 🧾 Get Recent Transactions
   */
  async getRecentTransactions(limit = 20) {
    const snapshot = await this.transactionsRef
      .orderBy('date', 'desc')
      .limit(limit)
      .get();

    return snapshot.docs.map((doc) => doc.data());
  }

  /**
   * 🔎 Filter Transactions
   */
  async getTransactionsByType(type: 'inflow' | 'outflow', limit = 50) {
    const snapshot = await this.transactionsRef
      .where('type', '==', type)
      .orderBy('date', 'desc')
      .limit(limit)
      .get();

    return snapshot.docs.map((doc) => doc.data());
  }
}
