import React, { useState } from 'react';
import ApiKeyInput from './components/ApiKeyInput';
import LoginByGoogle from './components/LoginByGoogle';
import EmailFetcher from './components/EmailFetcher';
import EmailClassifier from './components/EmailClassifier';
import EmailList from './components/EmailList';

const App = () => {
    const [apiKey, setApiKey] = useState(localStorage.getItem('openaiApiKey') || '');
    const [googleToken, setGoogleToken] = useState(null);
    const [emails, setEmails] = useState([]);
    const [userProfile, setUserProfile] = useState(null);

    const handleGoogleLoginSuccess = (response, profile) => {
        console.log('Google Login Success:', response);
        setGoogleToken(response);
        setUserProfile(profile);
    };

    const handleGoogleLoginFailure = (error) => {
        console.log('Google Login Failed:', error);
    };

    const handleLogout = () => {
        setGoogleToken(null);
        setUserProfile(null);
    };

    return (
        <div style={{ backgroundColor: '#1a1a1a', minHeight: '100vh', color: '#fff', fontFamily: 'Arial, sans-serif' }}>
            {!googleToken ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
                    <LoginByGoogle onSuccess={handleGoogleLoginSuccess} onFailure={handleGoogleLoginFailure} />
                    <div style={{ marginTop: '20px' }}>
                        <ApiKeyInput onSave={setApiKey} />
                    </div>
                </div>
            ) : (
                <>
                    <div style={{ padding: '20px', borderBottom: '1px solid #333' }}>
                        <h2>EmailClassifierBy-Aryan</h2>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '20px', borderBottom: '1px solid #333' }}>
                        <div>
                            <h3>{userProfile?.name || 'User'}</h3>
                            <p>{userProfile?.email}</p>
                            <button style={{ backgroundColor: '#2a2a2a', color: '#fff', border: 'none', padding: '10px', borderRadius: '5px', marginTop: '10px' }}>▼ {emails.length}</button>
                        </div>
                        <div>
                            <button style={{ backgroundColor: '#2a2a2a', color: '#fff', border: 'none', padding: '10px', borderRadius: '5px', marginRight: '10px' }} onClick={handleLogout}>Logout</button>
                            
                        </div>
                    </div>
                    <div style={{ padding: '20px' }}>
                        <EmailFetcher googleToken={googleToken} apiKey={apiKey} setEmails={setEmails} />
                        <EmailClassifier emails={emails} token={googleToken} />
                        {emails.length > 0 && <EmailList emails={emails} />} {/* Render EmailList only if emails are available */}
                    </div>
                </>
            )}
        </div>
    );
};

export default App;
