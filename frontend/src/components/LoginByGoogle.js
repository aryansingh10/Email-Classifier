import React, { useState, useEffect } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { FcGoogle } from 'react-icons/fc';

const LoginByGoogle = ({ onSuccess, onFailure }) => {
    const [user, setUser] = useState(null);
    const [userProfile, setUserProfile] = useState(null);

    const login = useGoogleLogin({
        onSuccess: (response) => {
            console.log('Google Login Success:', response);
            setUser(response);
            axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${response.access_token}`, {
                headers: {
                    Authorization: `Bearer ${response.access_token}`,
                    Accept: 'application/json',
                },
            })
            .then((res) => {
                setUserProfile(res.data);
                onSuccess(response, res.data);
            })
            .catch((err) => console.log(err));
        },
        onError: (error) => {
            console.log('Google Login Failed:', error);
            onFailure(error);
        },
        scope: 'profile email https://www.googleapis.com/auth/gmail.readonly',
    });

    const logout = () => {
        setUser(null);
        setUserProfile(null);
        onFailure("Logged out");
    };

    return (
        <div>
            {!user ? (
                <button 
                    onClick={() => login()} 
                    style={{ 
                        backgroundColor: '#2a2a2a', 
                        color: '#fff', 
                        border: 'none', 
                        padding: '15px 30px', 
                        borderRadius: '5px', 
                        fontSize: '16px', 
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%'
                    }}
                >
                    <FcGoogle style={{ marginRight: '10px', fontSize: '20px' }} /> Login with Google
                </button>
            ) : (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', borderBottom: '1px solid #333' }}>
                    <div>
                        <h3 style={{ margin: '0' }}>{userProfile?.name || 'User'}</h3>
                        <p style={{ margin: '5px 0 0', color: '#aaa' }}>{userProfile?.email}</p>
                    </div>
                    <div>
                        <button 
                            onClick={logout} 
                            style={{ 
                                backgroundColor: '#2a2a2a', 
                                color: '#fff', 
                                border: 'none', 
                                padding: '10px 20px', 
                                borderRadius: '5px', 
                                marginRight: '10px', 
                                cursor: 'pointer' 
                            }}
                        >
                            Logout
                        </button>
                        <button 
                            style={{ 
                                backgroundColor: '#2a2a2a', 
                                color: '#fff', 
                                border: 'none', 
                                padding: '10px 20px', 
                                borderRadius: '5px', 
                                cursor: 'pointer' 
                            }}
                        >
                    
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LoginByGoogle;