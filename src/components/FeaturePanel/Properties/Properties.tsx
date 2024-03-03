import React from 'react';
import { FeaturedTags } from '../FeaturedTags';
import { IdSchemeFields } from './IdSchemeFields';
import { t } from '../../../services/intl';
import { TagsTableInner } from './TagsTableInner';
import { useFeatureContext } from '../../utils/FeatureContext';
import { Subheading } from '../helpers/Subheading';
import { Wrapper } from './Wrapper';
import { Table } from './Table';
import { getUrlOsmId } from '../../../services/helpers';
import { Alert } from '@material-ui/lab';
import { captureException } from '../../../helpers/sentry';

class ErrorBoundary extends React.Component<
  { fallback: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    captureException(error, errorInfo);

    console.error({ error, errorInfo }); // eslint-disable-line no-console
  }

  render() {
    if (this.state.hasError) {
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

          {this.props.fallback || null}
        </div>
      );
    }

    return this.props.children;
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

  const key = feature && getUrlOsmId(feature.osmMeta);

  return (
    <>
      {showTags && <OnlyTagsTable />}
      {!showTags && (
        <ErrorBoundary key={key} fallback={<OnlyTagsTable />}>
          <FeaturedTags featuredTags={feature.schema?.featuredTags} />
          <IdSchemeFields />
        </ErrorBoundary>
      )}
    </>
  );
};
