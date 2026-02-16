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
                    username: firebaseUser.displayName || firebaseUser.email.split('@')[0],
                    points: 1000 // Default, will be updated by profile fetch if possible
                };

                // Better: Refresh user profile from our DB to get current points
                try {
                    const res = await axios.get('/api/user/profile');
                    userInfo.points = res.data.points;
                    userInfo.username = res.data.username || userInfo.username;
                } catch (err) {
                    console.error('Could not fetch user profile for points');
                }

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
        const res = await axios.post('/api/auth/signup', { username, email, password });
        await signInWithEmailAndPassword(auth, email, password);
        return res.data;
    };

    const deductPoints = async (amount = 5) => {
        try {
            const res = await axios.post('/api/user/deduct-points', { amount });
            const updatedUser = { ...user, points: res.data.points };
            setUser(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));
            return res.data.points;
        } catch (err) {
            console.error('Failed to deduct points:', err.response?.data?.msg);
            throw err;
        }
    };

    const logout = () => signOut(auth);

    return (
        <AuthContext.Provider value={{ user, token, loading, login, signup, logout, deductPoints }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
