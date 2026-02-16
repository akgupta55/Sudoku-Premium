import React from 'react';
import { GoogleLogin } from '@react-oauth/google';

const GoogleAuth = () => {
    const handleSuccess = (credentialResponse) => {
        console.log('Google Login Success:', credentialResponse);
        // Here you would send the token to your backend
    };

    const handleError = () => {
        console.log('Login Failed');
    };

    return (
        <div className="flex justify-center mt-6">
            <GoogleLogin
                onSuccess={handleSuccess}
                onError={handleError}
                theme="filled_blue"
                shape="pill"
            />
        </div>
    );
};

export default GoogleAuth;
