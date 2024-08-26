import React, { ChangeEvent, useState } from 'react';
import { Button } from '@mui/material';
import { fetchText } from '../../../services/fetch';
import { useFeatureContext } from '../../utils/FeatureContext';
import { getShortId } from '../../../services/helpers';
import { loginAndfetchOsmUser } from '../../../services/osmApiAuth';
import { intl } from '../../../services/intl';

const WIKIPEDIA_LIMIT = 100 * 1024 * 1024;
const VERCEL_LIMIT = 4 * 1024 * 1024;

const performUpload = async (file, feature) => {
  const formData = new FormData();
  formData.append('filename', file.name);
  formData.append('file', file);
  formData.append('osmShortId', getShortId(feature.osmMeta));
  formData.append('lang', intl.lang);

  const uploadResponse = await fetchText('/api/upload', {
    method: 'POST',
    body: formData,
  });

  console.log('uploadResponse', uploadResponse);
};

const performUploadWithLogin = async (file, feature) => {
  try {
    await performUpload(file, feature);
  } catch (e) {
    if (e.code === '401') {
      await loginAndfetchOsmUser();
      await performUpload(file, feature);
    }
  }
};

const getHandleFileUpload =
  (feature, setUploading, setResetKey) =>
  async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    if (file.size > WIKIPEDIA_LIMIT) {
      alert('Maximum file size is 100 MB.'); // eslint-disable-line no-alert
      return;
    }

    try {
      setUploading(true);
      await performUploadWithLogin(file, feature);
    } finally {
      setUploading(false);
      setResetKey((key) => key + 1);
    }
  };

const UploadButton = () => {
  const { feature } = useFeatureContext();
  const [uploading, setUploading] = useState(false);
  const [resetKey, setResetKey] = useState(0);

  const handleFileUpload = getHandleFileUpload(
    feature,
    setUploading,
    setResetKey,
  );

  return (
    <>
      <Button
        component="label"
        variant="contained"
        color="primary"
        // startIcon={<UploadFileIcon />}
        style={{ marginBottom: '1rem' }}
        disabled={uploading}
        key={resetKey}
        // endIcon={uploading ? <CircularProgress /> : undefined}
      >
        Nahrát obrázek
        <input
          type="file"
          // accept="image/*"
          hidden
          onChange={handleFileUpload}
        />
      </Button>
    </>
  );
};

export const UploadDialog = () => {
  const { feature } = useFeatureContext();
  const { osmMeta, skeleton } = feature;
  const editEnabled = !skeleton;

  return (
    <>
      {editEnabled && (
        <>
          <UploadButton />
          <br />
        </>
      )}
    </>
  );
};
