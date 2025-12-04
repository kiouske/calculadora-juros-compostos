export enum CalculationMode {
  STANDARD = 'STANDARD', // Simular Futuro (Input all 4)
  TIME_TO_MILLION = 'TIME_TO_MILLION', // Calculate Period
  CONTRIBUTION_TO_MILLION = 'CONTRIBUTION_TO_MILLION', // Calculate Monthly
}

export interface SimulationResult {
  totalInvested: number;
  totalInterest: number;
  totalAmount: number;
  timeInMonths: number;
  monthlyData: Array<{
    month: number;
    year: number;
    invested: number;
    interest: number;
    amount: number;
    accumulatedInterest: number;
  }>;
  yearlyData: Array<{
    year: number;
    invested: number;
    interest: number;
    amount: number;
    investedInYear: number;
    interestInYear: number;
  }>;
}

export interface InputState {
  initialValue: number;
  monthlyValue: number;
  interestRate: number;
  rateType: 'yearly' | 'monthly';
  period: number;
  periodType: 'years' | 'months';
}