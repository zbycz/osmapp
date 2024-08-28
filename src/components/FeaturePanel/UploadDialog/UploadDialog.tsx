import React, { ChangeEvent, useState } from 'react';
import { Button } from '@mui/material';
import { fetchJson, fetchText } from '../../../services/fetch';
import { useFeatureContext } from '../../utils/FeatureContext';
import { getShortId } from '../../../services/helpers';
import { loginAndfetchOsmUser } from '../../../services/osmApiAuth';
import { intl } from '../../../services/intl';
import { Feature } from '../../../services/types';

const WIKIPEDIA_LIMIT = 100 * 1024 * 1024;
const BUCKET_URL = 'https://osmapp-upload-tmp.s3.amazonaws.com/';

// Vercel has limit 4.5 MB on payload size, so we have to upload to S3 first
const uploadToS3 = async (file: File) => {
  const key = `${Math.random()}/${file.name}`;

  const body = new FormData();
  body.append('key', key);
  body.append('file', file);

  await fetchText(BUCKET_URL, { method: 'POST', body });

  return `${BUCKET_URL}${key}`;
};

const submitToWikimediaCommons = async (
  url: string,
  filename: string,
  feature: Feature,
) => {
  const shortId = getShortId(feature.osmMeta);

  const response = await fetchJson('/api/upload', {
    method: 'POST',
    body: JSON.stringify({ url, filename, shortId, lang: intl.lang }),
  });
};

const performUploadWithLogin = async (url, filename, feature) => {
  try {
    await submitToWikimediaCommons(url, filename, feature);
  } catch (e) {
    if (e.code === '401') {
      await loginAndfetchOsmUser();
      await submitToWikimediaCommons(url, filename, feature);
    }
  }
};

const getHandleFileUpload =
  (feature, setUploading, setResetKey) =>
  async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const filename = file.name;

    if (!file) {
      return;
    }

    if (file.size > WIKIPEDIA_LIMIT) {
      alert('Maximum file size for Wikipedia is 100 MB.'); // eslint-disable-line no-alert
      return;
    }

    try {
      setUploading(true);
      const url = await uploadToS3(file);
      const response = await submitToWikimediaCommons(url, filename, feature);

      console.log('response', response);
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
