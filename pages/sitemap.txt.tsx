import { fetchText } from '../src/services/fetch';

const Sitemap = () => null;

export const getServerSideProps = async ({ res }) => {
  const content = await fetchText(
    'https://zbycz.github.io/osm-static/sitemap.txt',
  );

  res.setHeader('Content-Type', 'text/plain');
  res.write(content);
  res.end();

  return {
    props: {},
  };
};

export default Sitemap;
