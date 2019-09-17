import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Router from 'next/router';
import axios from 'axios';
import Header from '../components/Header';

function profile(props) {
  const currentUser = props.user.user;
    return (
        <div>
          <Header status={props.user} />
          <div className="main-body">
            {currentUser.message && <h1>{currentUser.message}</h1>}
            <h1>{currentUser.username}</h1>
            <img src={currentUser.avatar} alt=""/>
          </div>
        </div>
    )
}

profile.getInitialProps = async (ctx) => {
  if (typeof window === 'undefined') {
    if (ctx.req.user === undefined) {
      ctx.res.writeHead(302, {
        Location: '/login'
      });
      ctx.res.end();
      return
    } else
    return {
      user: {user: ctx.req.user}
    }
  }
  let userData = await axios.get("https://fresh-memes.herokuapp.com/api/user_data");
  if (userData.data.user === undefined) {
    ctx.res.writeHead(302, {
      Location: '/login'
    });
    ctx.res.end();
    return
  } else
  return {
    user: userData.data
  }
};

export default profile;
