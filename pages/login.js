import React from 'react';
import LoginForm from '../components/LoginForm';

export default function login() {
    return (
      <div className="main-body">
        <div style={{marginTop: "5rem"}}>
          <LoginForm submit={() => {}} />
        </div>
      </div>
    )
}
