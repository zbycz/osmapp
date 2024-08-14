import * as Sentry from '@sentry/nextjs';
import Head from 'next/head';

const throwError = async () => {
  await Sentry.startSpan(
    {
      name: 'Example Frontend Span',
      op: 'test',
    },
    async () => {
      const res = await fetch('/api/sentry-example-api');
      if (!res.ok) {
        throw new Error('Sentry Example Frontend Error');
      }
    },
  );
};

const captureMessage = () => Sentry.captureMessage('Something went wrong');

const Page = () => (
  <main style={{ textAlign: 'center' }}>
    <h1>Sentry Test Page</h1>
    <button onClick={throwError}>Throw error!</button>
    <button onClick={captureMessage}>Capture Message</button>
    <br />
    <a href="https://osmapp.sentry.io/issues/?project=1858591">Issues</a>
    <Head>
      <meta name="robots" content="noindex" />
    </Head>
  </main>
);

export default Page;
