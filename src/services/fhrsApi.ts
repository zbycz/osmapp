import { fetchJson } from './fetch';

function fetchEstablishmentData(id: number) {
  return fetchJson(`https://api.ratings.food.gov.uk/Establishments/${id}`, {
    headers: {
      'x-api-version': '2',
    },
  });
}

export async function getEstablishmentRatingValue(id: number) {
  const allData = await fetchEstablishmentData(id).catch(() => null);
  const ratingString = allData?.RatingValue;
  const ratingValue = parseInt(ratingString, 10);
  return ratingValue;
}
