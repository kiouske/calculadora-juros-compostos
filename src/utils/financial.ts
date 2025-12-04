import { SimulationResult } from '../types';

export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

export const formatPercent = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value) + '%';
};

// Convert any rate to monthly rate (decimal)
const getMonthlyRate = (rate: number, type: 'yearly' | 'monthly'): number => {
  const decimalRate = rate / 100;
  if (type === 'monthly') return decimalRate;
  return Math.pow(1 + decimalRate, 1 / 12) - 1;
};

// Convert any period to months
export const getMonths = (period: number, type: 'years' | 'months'): number => {
  return type === 'years' ? period * 12 : period;
};

export const calculateCompoundInterest = (
  initial: number,
  monthly: number,
  rateValue: number,
  rateType: 'yearly' | 'monthly',
  periodValue: number,
  periodType: 'years' | 'months'
): SimulationResult => {
  const monthlyRate = getMonthlyRate(rateValue, rateType);
  const totalMonths = getMonths(periodValue, periodType);
  
  let currentAmount = initial;
  let totalInvested = initial;
  
  const monthlyData = [];
  const yearlyData = [];
  
  // Year trackers
  let yearInvested = 0;
  let yearInterest = 0;
  let lastYearAmount = initial;

  for (let i = 1; i <= totalMonths; i++) {
    const interestEarned = currentAmount * monthlyRate;
    currentAmount += interestEarned + monthly;
    totalInvested += monthly;
    
    // Trackers
    yearInvested += monthly;
    yearInterest += interestEarned;

    monthlyData.push({
      month: i,
      year: Math.ceil(i / 12),
      invested: totalInvested,
      interest: interestEarned, // Monthly interest
      accumulatedInterest: currentAmount - totalInvested,
      amount: currentAmount
    });

    // End of year or end of period
    if (i % 12 === 0 || i === totalMonths) {
      const yearIndex = Math.ceil(i / 12);
      // Correction for first year if starting with initial
      const investedInThisYear = (i <= 12 ? yearInvested + initial : yearInvested); 
      
      yearlyData.push({
        year: yearIndex,
        invested: totalInvested,
        interest: currentAmount - totalInvested, // Total accumulated interest
        amount: currentAmount,
        investedInYear: i === 12 ? yearInvested + initial : yearInvested, // include initial in first year flow
        interestInYear: yearInterest
      });
      
      // Reset year trackers
      yearInvested = 0;
      yearInterest = 0;
      lastYearAmount = currentAmount;
    }
  }

  return {
    totalInvested,
    totalInterest: currentAmount - totalInvested,
    totalAmount: currentAmount,
    timeInMonths: totalMonths,
    monthlyData,
    yearlyData
  };
};

export const calculateMonthsToTarget = (
  initial: number,
  monthly: number,
  rateValue: number,
  rateType: 'yearly' | 'monthly',
  target: number = 1000000
): number => {
  if (monthly <= 0 && initial < target && rateValue <= 0) return 0; // Impossible
  
  const monthlyRate = getMonthlyRate(rateValue, rateType);
  let current = initial;
  let months = 0;
  
  // Safety break after 100 years to prevent infinite loops
  while (current < target && months < 1200) {
    current += (current * monthlyRate) + monthly;
    months++;
  }
  
  return months;
};

export const calculateMonthlyContributionForTarget = (
  initial: number,
  rateValue: number,
  rateType: 'yearly' | 'monthly',
  periodValue: number,
  periodType: 'years' | 'months',
  target: number = 1000000
): number => {
  const monthlyRate = getMonthlyRate(rateValue, rateType);
  const months = getMonths(periodValue, periodType);
  
  // FV = P*(1+i)^n + PMT * [((1+i)^n - 1) / i]
  // Target - P*(1+i)^n = PMT * [((1+i)^n - 1) / i]
  // PMT = (Target - P*(1+i)^n) / [((1+i)^n - 1) / i]

  const futureValueInitial = initial * Math.pow(1 + monthlyRate, months);
  const remainder = target - futureValueInitial;
  
  if (remainder <= 0) return 0; // Already reached with initial
  
  if (monthlyRate === 0) {
    return remainder / months;
  }
  
  const compoundFactor = (Math.pow(1 + monthlyRate, months) - 1) / monthlyRate;
  
  return remainder / compoundFactor;
};