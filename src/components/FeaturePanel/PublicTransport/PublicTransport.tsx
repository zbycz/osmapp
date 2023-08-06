import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { requestLines } from './requestRoutes';
import { PublicTransportWrapper } from './PublicTransportWrapper';
import { FeatureTags } from '../../../services/types';
import { LineNumber } from './LineNumber';

interface PublicTransportProps {
  tags: FeatureTags;
}

export const PublicTransport: React.FC<PublicTransportProps> = ({ tags }) => {
  const isPublicTransport =
    Object.keys(tags).includes('public_transport') ||
    tags.railway === 'station';

  if (!isPublicTransport) {
    return null;
  }

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadData = async () => {
      const lines = await requestLines(
        router.query.all[0] as any,
        Number(router.query.all[1]),
      );
      setData(lines);
      setLoading(false);
    };

    loadData();
  }, []);

  return (
    <div>
      {loading ? (
        <div>...</div>
      ) : (
        <PublicTransportWrapper>
          {data.map((line) => (
            <LineNumber name={line.ref} color={line.colour} />
          ))}
        </PublicTransportWrapper>
      )}
    </div>
  );
};
