/**
 * Copyright (C) Cashbee SAS - All Rights Reserved
 *
 * This source code is protected under international copyright law.  All rights
 * reserved and protected by the copyright holders.
 */

import Alpine from 'alpinejs';

// If setting value on inputs is not possible on webflow, an option would be
// to pass $el as param here and iterate through labels and set value attr on each input
Alpine.data('productPicker', (defaultProduct, destination, defaultOpen = true) => ({
  init() {
    Alpine.effect(() => {
      if (!this.product || !this.open) return;
      Alpine.store('inputs')[`${destination}Product`] = this.product;
      Alpine.store('inputs')[`${destination}RiskLevel`] = this.piloteRiskLevel;
    });
  },
  open: defaultOpen,
  product: defaultProduct,
  piloteRiskLevel: 'risk3',

  clickDefault($el) {
    $($el).find(`.simulator--product-item, .simulator--risk-picker-item`).each(function() {
      const input = $(this).find('input');
      input.val(input.data('value'));
    });
    if (document.readyState === 'complete') {
      if (defaultProduct) $($el).find(`.simulator--product-picker-list input[value="${defaultProduct}"]`).click();
      $($el).find(`.simulator--risk-picker input[value="${this.piloteRiskLevel}"]`).click();
    } else {
      window.addEventListener('load', () => {
        if (defaultProduct) $($el).find(`.simulator--product-picker-list input[value="${defaultProduct}"]`).click();
        $($el).find(`.simulator--risk-picker input[value="${this.piloteRiskLevel}"]`).click();
      });
    }
  },

  toggleOpen() {
    this.open = !this.open;
    if (this.open) {
      Alpine.store('inputs')[`${destination}Product`] = this.product;
      Alpine.store('inputs')[`${destination}RiskLevel`] = this.piloteRiskLevel;
    }
  }
}));
