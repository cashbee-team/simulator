/**
 * Copyright (C) Cashbee SAS - All Rights Reserved
 *
 * This source code is protected under international copyright law.  All rights
 * reserved and protected by the copyright holders.
 */

const LIVRET_BOOST_RATE = 0.03;
const LIVRET_REGULAR_RATE = 0.02;
const PILOTE_SIMU_PARAMS = {
  'risk1': {
    expectedReturn: 3.8,
    finalVariance: 2.5,
  },
  'risk2': {
    expectedReturn: 4.8,
    finalVariance: 3,
  },
  'risk3': {
    expectedReturn: 5.68,
    finalVariance: 3.8,
  },
  'risk4': {
    expectedReturn: 7,
    finalVariance: 5,
  },
};
const INVESTMENT_SIMU_PARAMS = {
  'Immobilier': {
    expectedReturn: 3.5,
    finalVariance: 3.794733192,
  },
  'Relance': {
    expectedReturn: 11,
    finalVariance: 13.41640786,
  },
  'Équilibre': {
    expectedReturn: 3,
    finalVariance: 2,
  },
  'Private Equity': {
    expectedReturn: 12,
    finalVariance: 9.797958971,
  },
  'Santé': {
    expectedReturn: 10,
    finalVariance: 9.309493363,
  },
  'Or et mat. prem.': {
    expectedReturn: 12,
    finalVariance: 15,
  },
  'All weather': {
    expectedReturn: 5,
    finalVariance: 2.449489743,
  },
};

export function investedAmount(duration, initialAmount, monthlyAmount) {
  return (initialAmount + monthlyAmount * (duration * 12 - 1));
}

function livretCurrentRate(currentMonth) { // 3 is the number of month of bonus period
  return currentMonth <= 5 ? LIVRET_BOOST_RATE : LIVRET_REGULAR_RATE;
}

function livretEstimate(duration, initialAmount, monthlyAmount, _) {
  let baseLivret = initialAmount;
  let interestYear = 0;

  for (let month = 1; month <= 12 * duration; month++) {
    const monthIncrement = month === 1 ? 0 : monthlyAmount;
    const interestAmount = (baseLivret + monthIncrement) * livretCurrentRate(month) / 12;
    interestYear = interestYear + interestAmount;
    baseLivret = baseLivret + monthIncrement;
    if (month % 12 === 0) {
      baseLivret = baseLivret + interestYear;
      interestYear = 0;
    }
  }
  return [baseLivret];
}

function glEstimate(expectedReturn, finalVariance) {
  function computeEachYear(duration, initialAmount, monthlyAmount) {
    return Array.from({ length: duration }, (_, i) => i + 1)
      .reduce((prevYears, year) => {
        const [prevYear] = prevYears;

        const adjustedSigma = Math.sqrt(year * Math.pow(finalVariance, 2));
        const adjustedM = year * expectedReturn;

        const worstPerfThisYear = adjustedM - 2 * adjustedSigma - prevYear.adjustedM + 2 * prevYear.adjustedSigma;
        const bestPerfThisYear = adjustedM + 2 * adjustedSigma - prevYear.adjustedM - 2 * prevYear.adjustedSigma;

        const simuWorst = prevYear.simuWorst + prevYear.simuWorst * worstPerfThisYear / 100 + monthlyAmount * (12 + worstPerfThisYear / 100 * 6.5);
        const simuBest = prevYear.simuBest + prevYear.simuBest * bestPerfThisYear / 100 + monthlyAmount * (12 + bestPerfThisYear / 100 * 6.5);

        return [
          {
            adjustedSigma,
            adjustedM,
            simuWorst,
            simuBest,
          },
          ...prevYears,
        ];
      }, [{
        adjustedSigma: 0,
        adjustedM: 0,
        simuWorst: initialAmount,
        simuBest: initialAmount,
      }])
      .reverse();
  }

  return function(duration, initialAmount, monthlyAmount) {
    const eachYears = computeEachYear(duration, initialAmount, monthlyAmount);
    const lastYear = eachYears[eachYears.length - 1];
    return [lastYear.simuBest, lastYear.simuWorst];
  };
}

export const functionMapping = {
  //uses custom formula
  ['Livret']: livretEstimate,

  //Goes over each glSimulationParam and creates a function for each
  ...Object.entries(INVESTMENT_SIMU_PARAMS)
    .reduce((accumulator, [kind, { expectedReturn, finalVariance }]) => ({
      ...accumulator,
      [kind]: glEstimate(expectedReturn, finalVariance),
    }), {}),
  'Pilote Auto': function(duration, initialAmount, monthlyAmount, riskLevel) {
    const { expectedReturn, finalVariance } = PILOTE_SIMU_PARAMS[riskLevel];
    return glEstimate(expectedReturn, finalVariance)(duration, initialAmount, monthlyAmount);
  },
};
