import * as fetchModule from '../fetch';
import { getEstablishmentRatingValue } from '../fhrsApi';

describe('fetchRating', () => {
  it('should return a rating between 0 and 5', async () => {
    const fetchJsonMock = jest
      .spyOn(fetchModule, 'fetchJson')
      .mockResolvedValue({
        FHRSID: 423824,
        ChangesByServerID: 0,
        LocalAuthorityBusinessID: '13359',
        BusinessName: 'Caffe Nero',
        BusinessType: 'Restaurant/Cafe/Canteen',
        BusinessTypeID: 1,
        AddressLine1: '',
        AddressLine2: '30 Monmouth Street',
        AddressLine3: '',
        AddressLine4: 'London',
        PostCode: 'WC2H 9HA',
        Phone: '',
        RatingValue: '5',
        RatingKey: 'fhrs_5_en-gb',
        RatingDate: '2019-09-11T00:00:00',
        LocalAuthorityCode: '506',
        LocalAuthorityName: 'Camden',
        LocalAuthorityWebSite: 'http://www.camden.gov.uk',
        LocalAuthorityEmailAddress: 'foodsafety@camden.gov.uk',
        scores: {
          Hygiene: 0,
          Structural: 0,
          ConfidenceInManagement: 0,
        },
        SchemeType: 'FHRS',
        geocode: {
          longitude: '-0.1272279',
          latitude: '51.5136148',
        },
        RightToReply: '',
        Distance: null,
        NewRatingPending: false,
      });

    const rating = await getEstablishmentRatingValue(269382);
    expect(rating).toBeLessThanOrEqual(5);
    fetchJsonMock.mockRestore();
  });
});
