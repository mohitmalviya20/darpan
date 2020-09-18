import React, { useState } from "react";
import { Button, TextField, LinearProgress } from "@material-ui/core";
import { storage, db } from "./Firebase";
import firebase from "firebase";
import "./ImageUpload.css";

function ImageUpload({ username1 }) {
  const [image, setImage] = useState(null);
  const [progress, setProgress] = useState(0);
  const [caption, setCaption] = useState("");
  const handleChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };
  const handleUpload = () => {
    const uploadTask = storage.ref(`images/${image.name}`).put(image);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(progress);
      },
      (error) => {
        alert(error.message);
      },
      () => {
        storage
          .ref("images")
          .child(image.name)
          .getDownloadURL()
          .then((url) => {
            db.collection("post").add({
              timestamp: firebase.firestore.FieldValue.serverTimestamp(),
              caption: caption,
              imageUrl: url,
              username: username1,
            });
            setProgress(0);
            setCaption("");
            setImage(null);
          });
      }
    );
  };
  return (
    <div className="image_upload">
      <TextField
        id="outlined-basic"
        label="Enter some Caption"
        variant="outlined"
        size="small"
        onChange={(e) => setCaption(e.target.value)}
      />
      <input type="file" onChange={handleChange} id="file" hidden />
      <label for="file" className="select_file">
        CHOOSE FILE
      </label>
      <Button
        variant="outlined"
        color="primary"
        size="large"
        onClick={handleUpload}
      >
        Upload
      </Button>
      <LinearProgress variant="determinate" value={progress} max="100" />
    </div>
  );
}

export default ImageUpload;
