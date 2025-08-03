import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Stack,
  Typography,
} from '@mui/material';
import { useGetItems } from './useGetItems';
import OpenInNew from '@mui/icons-material/OpenInNew';
import styled from '@emotion/styled';
import { t } from '../../../../services/intl';
import React from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { QRCodeSVG } from 'qrcode.react';
import { useTheme } from '@emotion/react';

const AccordionStyle = {
  '&:before': {
    backgroundColor: 'transparent !important',
  },
};

const StyledUl = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

type LinkItemProps = {
  href: string;
  label: string;
};

const OpenInNewContainer = styled.div`
  margin-left: 8px;
  display: inline-block;
  position: relative;
  top: 2px;
`;

const LinkItem = ({ href, label }: LinkItemProps) => (
  <a href={href} target="_blank" onClick={(e) => e.stopPropagation()}>
    {t('sharedialog.openin')} {label}
    <OpenInNewContainer>
      <OpenInNew fontSize={'inherit'} />
    </OpenInNewContainer>
  </a>
);

export const OpenInSection = () => {
  const { items } = useGetItems();
  const theme = useTheme();
  const [expanded, setExpanded] = React.useState<number | undefined>(undefined);

  return (
    <section>
      <Typography variant="overline">{t('sharedialog.openin')}</Typography>

      <StyledUl>
        {items.map(({ label, href, image }, index) => (
          <Accordion
            disableGutters={true}
            elevation={0}
            sx={AccordionStyle}
            key={label}
            expanded={index === expanded}
            onChange={() => {
              setExpanded(index === expanded ? undefined : index);
            }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="body1">{label}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Stack direction="column" gap={2}>
                <QRCodeSVG
                  value={href}
                  size={128}
                  level="M"
                  bgColor="transparent"
                  fgColor={theme.palette.text.primary}
                  imageSettings={
                    image
                      ? {
                          src: image,
                          width: 32,
                          height: 32,
                          excavate: true,
                        }
                      : undefined
                  }
                />

                <LinkItem href={href} label={label} />
              </Stack>
            </AccordionDetails>
          </Accordion>
        ))}
      </StyledUl>
    </section>
  );
};
