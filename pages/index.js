import React from 'react';
import Link from 'next/link';

export default function index() {
    return (
        <div>
            <h1>Memetuoi</h1>
            <Link href="/signup">
                <a>Signup</a>
            </Link>
            <p>Or</p>
            <Link href="/auth/fblogin">
                <a>Login with Facebook</a>
            </Link>
        </div>
    )
}
