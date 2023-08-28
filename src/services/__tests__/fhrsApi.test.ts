import { getEstablishmentRatingValue } from '../fhrsApi';

describe('fetchRating', () => {
  it('should return a rating between 0 and 5', () => {
    const fhrsIds = ['988122', '269229', '268672', '268669'];

    fhrsIds.forEach(async (id) => {
      const rating = await getEstablishmentRatingValue(parseInt(id, 10));
      expect(rating).toBeGreaterThanOrEqual(0);
      expect(rating).toBeLessThanOrEqual(5);
    });
  });
});
