import React from 'react'

export default function signup() {
    return (
        <form action="/auth/signup" method="POST">
            <input id="username" name="username" type="text" placeholder="username" />
            <input id="email" name="email" type="email" placeholder="email" />
            <input id="password" name="password" type="password" placeholder="password" />
            <button>Signup</button>
        </form>
    )
}
