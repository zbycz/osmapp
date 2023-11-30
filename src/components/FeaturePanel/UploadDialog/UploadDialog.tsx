import React, { ChangeEvent, useState } from "react";
import { fetchText } from "../../../services/fetch";
import { Button } from "@material-ui/core";
import { useFeatureContext } from "../../utils/FeatureContext";
import {  getUrlOsmId } from "../../../services/helpers";

const UploadButton = () => {
  const { feature } = useFeatureContext();
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    if (file.size > 100 * 1024 * 1024) {
      alert("Maximum file size is 100 MB.");
      return;
    }

    setUploading(true);

    const formData = new FormData();
    formData.append("filename", file.name);
    formData.append("file", file);
    formData.append("osmEntity", getUrlOsmId(feature.osmMeta));

    try {
      const uploadResponse = await fetchText(
        "/api/upload",
        {
          method: "POST",
          body: formData
        }
      );

      console.log("uploadResponse", uploadResponse);
    }
    finally {
      setUploading(false);
    }
  };

  return (
    <>
      <Button
        component="label"
        variant="outlined"
        // startIcon={<UploadFileIcon />}
        sx={{ marginRight: "1rem" }}
        disabled={uploading}
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
          <br />
          <UploadButton />
        </>
      )}
    </>
  );
};
