import React from 'react';
import Feed from '../../components/Feed';
import axios from 'axios';
import Link from 'next/link';

export default function hot(props) {
    return (
        <div style={{ backgroundColor: "#ebebeb" }}>
            <Link href="/memes" as="/memes">
                <a>View top memes</a>
            </Link>
            <Feed data={props} />
        </div>
    )
}

hot.getInitialProps = async () => {
    if (typeof window === 'undefined') {
        const { data } = await axios.get(`https://reddit.com/r/funny/hot/.json?t=day&limit=100`);
        let posts = [];
        data.data.children.map((post, index) => {
            if (index !== 0) {
                posts.push({
                    title: post.data.title,
                    url: post.data.url,
                    is_video: post.data.is_video,
                    media: post.data.media,
                    type: post.data.post_hint,
                    likes: post.data.ups,
                    comments: post.data.num_comments
                })
            }
        });
        return posts;
    } else {
        const { data } = await axios.get(`https://cors-anywhere.herokuapp.com/https://reddit.com/r/funny/hot/.json?t=day&limit=100`);
        console.log(data);
        let posts = [];
        data.data.children.map((post, index) => {
            if (index !== 0) {
                posts.push({
                    title: post.data.title,
                    url: post.data.url,
                    is_video: post.data.is_video,
                    media: post.data.media,
                    type: post.data.post_hint,
                    likes: post.data.ups,
                    comments: post.data.num_comments
                })
            }
        });
        return posts;
    }
}
