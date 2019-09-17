import React from 'react';
import Feed from '../../components/Feed';
import axios from 'axios';
import Link from 'next/link';
import Header from '../../components/Header';

export default function index(props) {
  return (
    <div style={{ backgroundColor: "#ebebeb" }}>
      <Header status={props.user} />
      <div className="main-body">
        <Feed data={props.posts} />
      </div>
    </div>
  )
}

index.getInitialProps = async (ctx) => {
  if (typeof window === 'undefined') {
    const { data } = await axios.get(`https://reddit.com/r/funny/top/.json?t=day&limit=100`);
    let posts = [];
    data.data.children.map((post, index) => {
      posts[index] = {
        title: post.data.title,
        url: post.data.url,
        is_video: post.data.is_video,
        media: post.data.media,
        type: post.data.post_hint,
        likes: post.data.ups,
        comments: post.data.num_comments,
        domain: post.data.domain,
        preview: post.data.preview
      }
    });
    return {
      posts: posts,
      user: {user: ctx.req.user}
    };
  } else {
    const { data } = await axios.get(`https://cors-anywhere.herokuapp.com/https://reddit.com/r/funny/top/.json?t=day&limit=100`);
    const user = await axios.get("https://fresh-memes.herokuapp.com/api/user_data");
    let posts = [];
    data.data.children.map((post, index) => {
      posts[index] = {
        title: post.data.title,
        url: post.data.url,
        is_video: post.data.is_video,
        media: post.data.media,
        type: post.data.post_hint,
        likes: post.data.ups,
        comments: post.data.num_comments,
        domain: post.data.domain,
        preview: post.data.preview
      }
    });
    return {posts: posts, user: user.data};
  }
}
