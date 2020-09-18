import React, { useState, useEffect } from "react";
import { db } from "./Firebase";
import firebase from "firebase";
import "./Post.css";
import Avatar from "@material-ui/core/Avatar";

function Post({ user, postId, username, imageUrl, caption }) {
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");

  useEffect(() => {
    let unsubscribe;
    if (postId) {
      unsubscribe = db
        .collection("post")
        .doc(postId)
        .collection("comments")
        .orderBy("timestamp")
        .onSnapshot((snapshot) => {
          setComments(snapshot.docs.map((doc) => doc.data()));
        });
    }
    return () => {
      unsubscribe();
    };
  }, [postId]);

  const postComment = (e) => {
    e.preventDefault();
    db.collection("post").doc(postId).collection("comments").add({
      text: comment,
      username: user.displayName,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });
    setComment("");
  };
  return (
    <div className="post">
      {" "}
      <div className="post_header">
        <Avatar
          alt={username}
          src="/static/images/avatar/1.jpg"
          className="post_avatar"
        />
        <h3>{username}</h3>
      </div>
      <img className="post_image" src={imageUrl} alt="photoss" />
      <h4 className="post_text">
        <strong>{username}</strong> {caption}
      </h4>
      <div className="post_comments">
        {comments.map((comment) => (
          <p className="comment_body">
            <b>{comment.username}</b> {comment.text}
          </p>
        ))}
      </div>
      {user && (
        <form className="post_comment">
          <input
            className="post_input"
            type="text"
            placeholder="Add comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <button
            className="post_button"
            disabled={!comment}
            type="submit"
            onClick={postComment}
          >
            Post
          </button>
        </form>
      )}
    </div>
  );
}

export default Post;
