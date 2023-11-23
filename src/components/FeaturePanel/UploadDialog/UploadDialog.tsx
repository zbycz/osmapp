import React, { ChangeEvent, useState } from "react";
import { fetchJson } from "../../../services/fetch";
import { Button } from "@material-ui/core";
import { useFeatureContext } from "../../utils/FeatureContext";

const UploadButton = () => {
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }
    setUploading(true);

    const formData = new FormData();
    formData.append("filename", file.name);
    formData.append("file", file);

    const uploadResponse = await fetchJson(
      process.env.NEXT_PUBLIC_BASE_URL + "/api/upload",
      {
        method: "POST",
        body: formData
      }
    );

    console.log("uploadResponse", uploadResponse);

    setUploading(false);
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
          accept="image/*"
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
