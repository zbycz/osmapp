import React from 'react';
import { Alert } from '@mui/material';
import { FeaturedTags } from '../FeaturedTags';
import { IdSchemaFields } from './IdSchemaFields';
import { t } from '../../../services/intl';
import { TagsTableInner } from './TagsTableInner';
import { useFeatureContext } from '../../utils/FeatureContext';
import { Subheading } from '../helpers/Subheading';
import { Wrapper } from './Wrapper';
import { Table } from './Table';
import { getReactKey, getShortId } from '../../../services/helpers';
import * as Sentry from '@sentry/nextjs';
import { MyRouteTicks } from '../Climbing/Ticks/MyRouteTicks';

import { isFeatureClimbingRoute } from '../../../utils';

class ErrorBoundary extends React.Component<
  { fallback: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    Sentry.captureException(error, errorInfo);
    console.error({ error, errorInfo }); // eslint-disable-line no-console
  }

  render() {
    const { hasError } = this.state;
    const { fallback, children } = this.props;

    if (hasError) {
      // const tryAgain = () => this.setState({ hasError: false });

      return (
        <div>
          <Alert
            variant="outlined"
            severity="info"
            style={{ marginBottom: '2em' }}
          >
            There was an error displaying fields. Showing tags instead.
          </Alert>

          {fallback || null}
        </div>
      );
    }

    return children;
  }
}

const OnlyTagsTable = () => {
  const { feature } = useFeatureContext();

  return (
    <>
      {!!Object.keys(feature.tags).length && (
        <Subheading>{t('featurepanel.all_tags_heading')}</Subheading>
      )}
      <Wrapper>
        <Table>
          <tbody>
            <TagsTableInner tags={feature.tags} center={feature.center} />
          </tbody>
        </Table>
      </Wrapper>
    </>
  );
};

export const Properties = ({ showTags }) => {
  const { feature } = useFeatureContext();
  const shortOsmId = getShortId(feature?.osmMeta);

  return (
    <>
      {showTags && <OnlyTagsTable />}

      {!showTags && (
        <ErrorBoundary key={getReactKey(feature)} fallback={<OnlyTagsTable />}>
          <FeaturedTags featuredTags={feature.schema?.featuredTags} />
          <IdSchemaFields />
        </ErrorBoundary>
      )}

      {isFeatureClimbingRoute(feature) && (
        <MyRouteTicks shortOsmId={shortOsmId} />
      )}
    </>
  );
};
