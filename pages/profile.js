import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

function profile(props) {
    const [user, setUser] = useState({});
    useEffect(() => {
        const getUser = async () => {
            const { data } = await axios.get(`/users/${props.userId}`);
            setUser(data);
        }
        getUser();
    }, []);
    return (
        <div>
            {user.message && <h1>{user.message}</h1>}
            <h1>{user.username}</h1>
            <img src={user.avatar} alt=""/>
        </div>
    )
}

profile.getInitialProps = async ({ query }) => {
    return query;
};

export default profile;
