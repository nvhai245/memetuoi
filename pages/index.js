import React from 'react';
import Link from 'next/link';
import RouterLink from '../src/Link';

export default function index() {
    return (
        <div>
            <h1>Memetuoi</h1>
            <RouterLink href="/signup">
                <a>Signup</a>
            </RouterLink>
            <p></p>
            <RouterLink href="/login">
                <a>Login</a>
            </RouterLink>
            <p>Or</p>
            <RouterLink href="/auth/fblogin">
                <a>Login with Facebook</a>
            </RouterLink>
            <p>Or</p>
            <RouterLink href="/auth/gglogin">
                <a>Login with Google</a>
            </RouterLink>
            <p>Or</p>
            <RouterLink href="/create">
                <a>Create new meme</a>
            </RouterLink>
            <p>Or</p>
            <RouterLink href="/memes" as="/memes">
                <a>View top memes</a>
            </RouterLink>
        </div>
    )
}
