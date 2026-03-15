import api from './apiClient';

export const ledgerService = {
  addCredit(data: any) {
    return api.post('/ledger/credit', data);
  },

  addDebit(data: any) {
    return api.post('/ledger/debit', data);
  },

  getHistory(customerId: number) {
    return api.get(`/ledger/${customerId}`);
  }
};
