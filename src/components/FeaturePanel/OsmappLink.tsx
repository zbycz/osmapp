import React, { useState } from "react";
import AddToPhotosIcon from '@material-ui/icons/AddToPhotos';
import LibraryAddCheckIcon from '@material-ui/icons/LibraryAddCheck';
import IconButton from "@material-ui/core/IconButton";
import { useFeatureContext } from "../utils/FeatureContext";
import { getFullOsmappLink } from "../../services/helpers";
import styled from "styled-components";


const CopyButton = styled(IconButton)`
  margin-top: -3px !important;
  margin-left: -3px !important;

  svg {
    color: #aaa;
    font-size: 14px;
  }
`;

export const OsmappLink = () => {
  const { feature } = useFeatureContext();
  const osmappLink = getFullOsmappLink(feature);
  const [copied, setCopied] = useState(false);

  const handleClick = () => {
    navigator.clipboard.writeText(osmappLink)
    setCopied(true);
  };
  return (
    <div>
      <a href={osmappLink}>{osmappLink}</a>

      <CopyButton onClick={handleClick}>
        {copied ? (<LibraryAddCheckIcon/>) : (<AddToPhotosIcon />)}
      </CopyButton>
    </div>
  );
};
