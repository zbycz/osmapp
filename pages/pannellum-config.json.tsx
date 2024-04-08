export const Config = () => null;

export const getServerSideProps = async ({ res }) => {
  res.setHeader('Content-Type', 'application/json');

  res.setHeader('Access-Control-Allow-Origin', 'https://cdn.pannellum.org');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-Requested-With, Content-Type, Accept',
  );

  res.write(
    JSON.stringify({
      showZoomCtrl: false,
      autoLoad: true,
      autoRotate: -1,
    }),
  );
  res.end();

  return { props: {} };
};

export default Config;
