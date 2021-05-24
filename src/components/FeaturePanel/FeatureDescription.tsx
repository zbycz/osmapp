import IconButton from '@material-ui/core/IconButton';
import React from 'react';
import styled from 'styled-components';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import CloseIcon from '@material-ui/icons/Close';
import { capitalize, useToggleState } from '../helpers';
import { t } from '../../services/intl';

const StyledIconButton = styled(IconButton)`
  position: absolute !important; /* TODO mui styles takes precendence, why? */
  margin-top: -10px !important;
  margin-left: -8px !important;

  svg {
    font-size: 17px;
  }
`;

const A = ({ href, children }) =>
  href ? (
    <a href={href} target="_blank" rel="noopener" className="colorInherit">
      {children}
    </a>
  ) : (
    children
  );

const getUrls = ({ type, id, changeset, user }) => ({
  itemUrl: `https://openstreetmap.org/${type}/${id}`,
  historyUrl: `https://openstreetmap.org/${type}/${id}/history`,
  changesetUrl: changeset && `https://openstreetmap.org/changeset/${changeset}`, // prettier-ignore
  userUrl: user && `https://openstreetmap.org/user/${user}`,
});

export const FeatureDescription = ({ osmMeta, nonOsmObject, setAdvanced }) => {
  const [isShown, toggle] = useToggleState(false);

  const { timestamp = '2001-00-00', type, user, version = '?' } = osmMeta;
  const { itemUrl, historyUrl, changesetUrl, userUrl } = getUrls(osmMeta);
  const date = timestamp?.split('T')[0];

  const description = nonOsmObject
    ? t('featurepanel.feature_description_nonosm', { type })
    : t('featurepanel.feature_description_osm', { type: capitalize(type) });

  const onClick = (e) => {
    if (!isShown) {
      if (e.shiftKey && e.altKey) setAdvanced(true);
    } else {
      setAdvanced(false);
    }
    toggle();
  };

  return (
    <div>
      {!isShown && description}
      {isShown && (
        <>
          <A href={itemUrl}>{capitalize(type)}</A> •{' '}
          <A href={historyUrl}>version {version}</A> •{' '}
          <A href={changesetUrl}>{date}</A> •{' '}
          <A href={userUrl}>{user || 'n/a'}</A>
        </>
      )}

      <StyledIconButton
        title="Alt+Shift+click to enable advanced mode (show-all-tags, show-members, around-show-all)"
        onClick={onClick}
      >
        {!isShown && <InfoOutlinedIcon fontSize="small" color="secondary" />}
        {isShown && <CloseIcon fontSize="small" color="disabled" />}
      </StyledIconButton>
    </div>
  );
};
