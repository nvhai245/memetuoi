import React from 'react';
import MemesGrid from '../components/MemesGrid';
import axios from 'axios';

export default function create(props) {
    return (
        <div>
            <MemesGrid items={props.data.memes} />
        </div>
    )
}

create.getInitialProps = async () => {
    const { data } = await axios.get('https://api.imgflip.com/get_memes');
    return data;
};