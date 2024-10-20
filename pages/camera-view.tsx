import { GetServerSideProps } from 'next';
import { views } from '../src/services/landmarks/views';

export const Config = () => null;

export const getServerSideProps: GetServerSideProps = async ({
  res,
  query,
}) => {
  res.setHeader('Content-Type', 'application/json');

  const responseBody = views[`${query.shortId}`] ?? null;
  res.write(JSON.stringify(responseBody));
  res.end();

  return { props: {} };
};

export default Config;
