import { counters, attentionItems, todayTimeline, statusDistribution, revenueSeries, topProducts } from "@/lib/ops";

export const dashboardService = {
  getDashboardData() {
    return {
      counters: counters(),
      attention: attentionItems(),
      timeline: todayTimeline(),
      distribution: statusDistribution(),
      revenueSeries: revenueSeries(30),
      topProducts: topProducts(5),
    };
  },
};
