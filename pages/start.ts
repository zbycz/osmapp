// This route handles the PWA start page,
// which is a redirect to the last visited page.
// see manifest-*.json

export const getServerSideProps = async ({ req, res }) => {
  res.setHeader('Location', req.cookies['last-url'] ?? '/');
  res.statusCode = 302;
  res.end();

  return {
    props: {},
  };
};

export default () => null;
