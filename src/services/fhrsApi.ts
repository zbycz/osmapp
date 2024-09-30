import { fetchJson } from './fetch';

type FhrsResponse = {
  RatingDate: string;
  RatingKey: string;
  RatingValue: '1' | '2' | '3' | '4' | '5';
  SchemeType: 'FHRS';
};

function fetchEstablishmentData(id: number) {
  return fetchJson<FhrsResponse>(
    `https://api.ratings.food.gov.uk/Establishments/${id}`,
    {
      headers: { 'x-api-version': '2' },
    },
  );
}

export async function getEstablishmentRatingValue(id: number) {
  const allData = await fetchEstablishmentData(id).catch(() => null);
  const ratingString = allData?.RatingValue;
  const ratingValue = parseInt(ratingString, 10);
  return ratingValue;
}
