import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from 'firebase/auth';
import { auth } from '../config/firebase';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                const idToken = await firebaseUser.getIdToken();
                setToken(idToken);
                localStorage.setItem('token', idToken);
                axios.defaults.headers.common['Authorization'] = `Bearer ${idToken}`;

                // Fetch/Set user info. Display name might come from Firebase.
                const userInfo = {
                    id: firebaseUser.uid,
                    email: firebaseUser.email,
                    username: firebaseUser.displayName || firebaseUser.email.split('@')[0]
                };
                setUser(userInfo);
                localStorage.setItem('user', JSON.stringify(userInfo));
            } else {
                setToken(null);
                setUser(null);
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                delete axios.defaults.headers.common['Authorization'];
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const login = async (email, password) => {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return userCredential.user;
    };

    const signup = async (username, email, password) => {
        // We still use our backend signup to handle Firestore record creation 
        // OR we could use Firebase client SDK for everything. 
        // Let's use the backend to keep it consistent with our migration plan.
        const res = await axios.post('/api/auth/signup', { username, email, password });
        // After backend signup, we sign in the user on the client
        await signInWithEmailAndPassword(auth, email, password);
        return res.data;
    };

    const logout = () => signOut(auth);

    return (
        <AuthContext.Provider value={{ user, token, loading, login, signup, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
