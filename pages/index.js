import React from 'react';
import Link from 'next/link';

export default function index() {
    return (
        <div>
            <h1>Memetuoi</h1>
            <Link href="/signup">
                <a>Signup</a>
            </Link>
            <p></p>
            <Link href="/login">
                <a>Login</a>
            </Link>
            <p>Or</p>
            <Link href="/auth/fblogin">
                <a>Login with Facebook</a>
            </Link>
            <p>Or</p>
            <Link href="/auth/gglogin">
                <a>Login with Google</a>
            </Link>
        </div>
    )
}
