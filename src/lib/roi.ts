import { PACKAGES } from "./data";

export interface RoiInput {
  staff: number;
  manualHoursPerWeek: number;
  hourlyCost: number;
  monthlyRevenue: number;
  packageId: string;
}

/** Estimate monthly hours saved, cost saved and added revenue for a package (4.33 weeks per month). */
export function estimateRoi(i: RoiInput) {
  const pkg = PACKAGES.find((p) => p.id === i.packageId) ?? PACKAGES[0];
  const hoursSaved = i.staff * i.manualHoursPerWeek * 4.33 * pkg.automation;
  const costSaved = hoursSaved * i.hourlyCost;
  const revenueGain = i.monthlyRevenue * pkg.growth;
  const monthlyBenefit = costSaved + revenueGain;
  const investment = (pkg.range[0] + pkg.range[1]) / 2;
  const paybackMonths = monthlyBenefit > 0 ? investment / monthlyBenefit : Infinity;
  return {
    pkg,
    hoursSaved,
    costSaved,
    revenueGain,
    monthlyBenefit,
    investment,
    paybackMonths,
    annualRoi: monthlyBenefit > 0 ? ((monthlyBenefit * 12 - investment) / investment) * 100 : -100,
  };
}
