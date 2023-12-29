import Link from 'next/link';
import React from 'react';
import { Box, Typography } from '@mui/material';
import { getUrlOsmId } from '../../services/helpers';
import { useFeatureContext } from '../utils/FeatureContext';

export const Members = () => {
  const {
    feature: { members },
  } = useFeatureContext();

  return members?.length ? (
    <Box mt={4}>
      <Typography variant="overline" display="block" color="textSecondary">
        Relation members
      </Typography>
      <ul>
        {members.map((item) => {
          const urlOsmId = getUrlOsmId({ type: item.type, id: item.ref });
          return (
            <li>
              <Link href={`/${urlOsmId}`}>
                {item.role ? `${item.role} – ${urlOsmId}` : urlOsmId}
              </Link>
            </li>
          );
        })}
      </ul>
    </Box>
  ) : null;
};
