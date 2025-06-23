// remove this after 11/2025

export const getServerSideProps = async ({ req, res }) => {
  res.setHeader('Location', req.url.replace('/feature/', '/'));
  res.statusCode = 302;
  res.end();

  return {
    props: {},
  };
};

export default () => null;
