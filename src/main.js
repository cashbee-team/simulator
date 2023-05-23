/**
 * Copyright (C) Cashbee SAS - All Rights Reserved
 *
 * This source code is protected under international copyright law.  All rights
 * reserved and protected by the copyright holders.
 */

import Alpine from 'alpinejs';
import { functionMapping, investedAmount } from './computeEstimate.js';
import './helpers.js';
import './chart.js';
import './productPicker.js';
import { DEFAULT_MAIN_PRODUCT } from './constants.js';

Alpine.store('inputs', {
  init() {
    Alpine.effect(() => {
      this.setOutputs();
    });
  },
  initialAmount: 10000,
  monthlyAmount: 500,
  duration: 8,
  mainProduct: DEFAULT_MAIN_PRODUCT,
  secondProductSelector: false,
  secondProduct: null,

  toggleCompare() {
    this.secondProductSelector = !this.secondProductSelector;
    if (!this.secondProductSelector && this.secondProduct) {
      this.secondProduct = null;
      this.secondBest = null;
      this.secondWorst = null;
      Alpine.store('chart').unsetSecond();
    }
  },
  setOutputs() {
    this.setMainOutputs();
    if (this.secondProduct) this.setSecondOutputs();
    // document.getElementById('secondResultBestField').value = this.secondBest;
    // document.getElementById('secondResultWorstField').value = this.secondWorst;
    document.getElementById('initialAmountField').value = this.initialAmount;
    document.getElementById('monthlyAmountField').value = this.monthlyAmount;
    document.getElementById('durationField').value = this.duration;
    document.getElementById('productField').value = this.mainProduct;
  },
  setMainOutputs() {
    const [base, mainBest, mainWorst] = this.computeEstimate(this.mainProduct, this.mainRiskLevel);
    this.base = base;

    // text
    this.mainBest = { value: mainBest, percent: (mainBest / base - 1) * 100, diff: (mainBest - base) };
    this.mainWorst = mainWorst ? {
      value: mainWorst, percent: (mainWorst / base - 1) * 100, diff: (mainWorst - base),
    } : null;

    //chart
    Alpine.store('chart').setBase(base);
    Alpine.store('chart').setMain(this.mainProduct, mainBest, mainWorst);

    // form
    document.getElementById('resultBaseField').value = this.base;
    document.getElementById('resultBestField').value = this.mainBest.value;
    document.getElementById('resultWorstField').value = this.mainWorst ? this.mainWorst.value : 0;
  },
  setSecondOutputs() {
    const [base, secondBest, secondWorst] = this.computeEstimate(this.secondProduct, this.secondRiskLevel);

    // text
    this.secondBest = { value: secondBest, percent: (secondBest / base - 1) * 100, diff: (secondBest - base) };
    this.secondWorst = secondWorst ? {
      value: secondWorst, percent: (secondWorst / base - 1) * 100, diff: (secondWorst - base),
    } : null;

    //chart
    Alpine.store('chart').setSecond(this.secondProduct, secondBest, secondWorst);

    // form
    // ??
  },
  computeEstimate(product, piloteRiskLevel) {
    const base = investedAmount(this.duration, this.initialAmount, this.monthlyAmount);
    const [best, worst] = functionMapping[product](this.duration, this.initialAmount, this.monthlyAmount, piloteRiskLevel);
    return [base, best, worst];
  },
});

Alpine.start();
