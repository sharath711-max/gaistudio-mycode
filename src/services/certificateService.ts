import api from './apiClient';

export const certificateService = {
  generateGold(testId: number) {
    return api.post('/gold-certificates', { testId });
  },

  generateSilver(testId: number) {
    return api.post('/silver-certificates', { testId });
  },

  generatePhoto(testId: number) {
    return api.post('/photo-certificates', { testId });
  }
};
