import React from 'react';
import MemesGrid from '../components/MemesGrid';
import axios from 'axios';
import Header from '../components/Header';

export default function create(props) {
  return (
    <div>
      <Header status={props.user}/>
      <div className="main-body">
        <MemesGrid items={props.memeData.data.memes} />
      </div>
    </div>
  )
}

create.getInitialProps = async (ctx) => {
  const { data } = await axios.get('https://api.imgflip.com/get_memes');
  if (typeof window === 'undefined') {
    return {
      user: {user: ctx.req.user},
      memeData: data
    }
  }
  let userData = await axios.get("https://fresh-memes.herokuapp.com/api/user_data");
  return {
    user: userData.data,
    memeData: data
  }
};
