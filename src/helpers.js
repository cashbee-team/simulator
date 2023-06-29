/**
 * Copyright (C) Cashbee SAS - All Rights Reserved
 *
 * This source code is protected under international copyright law.  All rights
 * reserved and protected by the copyright holders.
 */

import Alpine from 'alpinejs';
import { DEFAULT_MAIN_PRODUCT } from './constants.js';

Alpine.data('helpers', () => ({
  defaultMainProduct: DEFAULT_MAIN_PRODUCT,
  formatNumber(value, prefix = false) {
    const formatted = value.toLocaleString('fr-FR', {
      minimumFractionDigits: Math.ceil(value % 1) * 2, maximumFractionDigits: 2,
    });
    return prefix ? this._prefixed(formatted) : formatted;
  },
  formatCurrency(value, prefix = false) {
    const formatted = value.toLocaleString('fr-FR', {
      style: 'currency', currency: 'EUR', minimumFractionDigits: Math.ceil(value % 1) * 2, maximumFractionDigits: 2,
    });
    return prefix ? this._prefixed(formatted) : formatted;
  },
  _prefixed(formatted) {
    return `${formatted[0] !== '-' ? '+' : ''}${formatted}`;
  },
}));
