import React, { useState, useEffect } from "react";
import "./App.css";
import darpan from "./darpan.png";
import Post from "./components/Post";
import { db, auth } from "./components/Firebase";

import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import { Button, TextField } from "@material-ui/core";
import ImageUpload from "./components/ImageUpload";

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const classes = useStyles();
  const [openSignIn, setOpenSignIn] = useState(false);
  const [modalStyle] = useState(getModalStyle);
  const [post, setPost] = useState([]);
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        console.log(authUser);
        setUser(authUser);
      } else {
        setUser(null);
      }
    });
    return () => {
      unsubscribe();
    };
  }, [user, username]);

  useEffect(() => {
    db.collection("post")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        setPost(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            post: doc.data(),
          }))
        );
      });
  }, []);

  const signUp = (e) => {
    e.preventDefault();
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        return authUser.user.updateProfile({ displayName: username });
      })
      .catch((error) => alert(error.message));
    setOpen(false);
  };
  const signIn = (e) => {
    e.preventDefault();
    auth
      .signInWithEmailAndPassword(email, password)
      .catch((error) => alert(error.message));
    setOpenSignIn(false);
  };
  return (
    <div className="app">
      <Modal open={open} onClose={() => setOpen(false)}>
        <div style={modalStyle} className={classes.paper}>
          <center>
            <img className="app_header_image" src={darpan} alt="app logo" />
          </center>
          <form className="app_signup">
            <TextField
              type="text"
              id="outlined-basic"
              label="Username"
              variant="outlined"
              className="input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <TextField
              type="email"
              id="outlined-basic"
              label="Email"
              variant="outlined"
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              type="password"
              id="outlined-basic"
              label="Password"
              variant="outlined"
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button type="submit" onClick={signUp} className="input">
              Sign Up
            </Button>
          </form>
        </div>
      </Modal>

      <Modal open={openSignIn} onClose={() => setOpenSignIn(false)}>
        <div style={modalStyle} className={classes.paper}>
          <center>
            <img className="app_header_image" src={darpan} alt="app logo" />
          </center>
          <form className="app_signup">
            <TextField
              type="email"
              id="outlined-basic"
              label="Email"
              variant="outlined"
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              type="password"
              id="outlined-basic"
              label="Password"
              variant="outlined"
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button type="submit" onClick={signIn} className="input">
              Sign in
            </Button>
          </form>
        </div>
      </Modal>

      <div className="app_header">
        <img className="app_header_image" src={darpan} alt="app logo" />
        {user ? (
          <Button
            variant="outlined"
            color="primary"
            className="app_button"
            onClick={() => auth.signOut()}
          >
            Logout
          </Button>
        ) : (
          <div>
            <Button
              variant="outlined"
              color="primary"
              className="app_button"
              onClick={() => setOpenSignIn(true)}
            >
              Sign in
            </Button>
            <Button
              variant="outlined"
              color="primary"
              className="app_button"
              onClick={() => setOpen(true)}
            >
              Sign up
            </Button>
          </div>
        )}
      </div>
      <div className="app_posts">
        {post.map(({ id, post }) => (
          <Post
            user={user}
            postId={id}
            username={post.username}
            imageUrl={post.imageUrl}
            caption={post.caption}
          />
        ))}
      </div>
      {user?.displayName ? (
        <ImageUpload username1={user.displayName} />
      ) : (
        <h3>You need to login to upload</h3>
      )}
    </div>
  );
}

export default App;
