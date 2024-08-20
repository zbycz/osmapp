export const WIKI_URL = 'https://test.wikidata.org/w/api.php';

export const getUploadBody = (params: Record<string, string | Blob>) => {
  const formData = new FormData();
  Object.entries(params).forEach(([k, v]) => {
    formData.append(k, v);
  });
  return formData;
};

export const getBody = (params: Record<string, string | Blob>) =>
  params.action === 'upload'
    ? getUploadBody(params)
    : new URLSearchParams(params);

export function parseCookies(response: Response) {
  const headers = new Headers(response.headers);
  const setCookies = headers.getSetCookie();

  return setCookies
    .map((cookie) => {
      const [name, value] = cookie.split(';')[0].split('=');
      return `${name.trim()}=${value.trim()}`;
    })
    .join('; ');
}
