import React from 'react';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../config/firebase';
import { motion } from 'framer-motion';

const GoogleAuth = () => {
    const handleGoogleLogin = async () => {
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            console.log('Google Login Success:', result.user);
            // User is now logged in via Firebase!
            // AuthContext's onAuthStateChanged will handle the rest.
        } catch (error) {
            console.error('Google Login Error:', error.message);
        }
    };

    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleGoogleLogin}
            className="w-full bg-white/5 border border-white/10 text-white font-medium py-3.5 rounded-2xl flex items-center justify-center gap-3 group transition-all"
        >
            <img
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                alt="Google"
                className="w-5 h-5 group-hover:scale-110 transition-transform"
            />
            Sign in with Google
        </motion.button>
    );
};

export default GoogleAuth;
