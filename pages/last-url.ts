const LastUrl = () => null;

export const getServerSideProps = async ({ req, res }) => {
  res.setHeader('Location', req.cookies['last-url'] ?? '/');
  res.statusCode = 302;
  res.end();

  return {
    props: {},
  };
};

export default LastUrl;
