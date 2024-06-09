import React, { useEffect, useState } from 'react';
import axios from 'axios';

function EmailClassifier({ emails }) {
    const [classifiedEmails, setClassifiedEmails] = useState([]);
    const [openaiApiKey, setOpenaiApiKey] = useState(localStorage.getItem('openaiApiKey') || '');

    useEffect(() => {
        localStorage.setItem('openaiApiKey', openaiApiKey);
    }, [openaiApiKey]);

    const handleClassifyEmails = async () => {
        try {
            if (!emails || emails.length === 0) {
                alert('No emails to classify.');
                return;
            }

            const requestBody = openaiApiKey ? { emails, apiKey: openaiApiKey } : { emails };

            const response = await axios.post('http://localhost:5000/classify-emails', requestBody);

            setClassifiedEmails(response.data);

            alert('Emails classified successfully.');
        } catch (error) {
            console.error('Error classifying emails:', error);
            alert('Error classifying emails. Please try again later.');
        }
    };

    return (
        <div style={{ padding: '20px', backgroundColor: '#121212', color: '#fff', borderRadius: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                <input 
                    type="text" 
                    value={openaiApiKey}
                    onChange={(e) => setOpenaiApiKey(e.target.value)}
                    placeholder="Enter OpenAI API Key"
                    style={{ 
                        flexGrow: 1,
                        padding: '10px', 
                        borderRadius: '5px', 
                        border: '1px solid #444', 
                        marginRight: '10px' 
                    }}
                />
                <button 
                    onClick={handleClassifyEmails}
                    style={{ 
                        backgroundColor: '#2a2a2a', 
                        color: '#fff', 
                        border: 'none', 
                        padding: '10px 20px', 
                        borderRadius: '5px', 
                        cursor: 'pointer' 
                    }}
                >
                    Classify Emails
                </button>
            </div>
            {classifiedEmails.length > 0 && (
                <div>
                    <h3>Classified Emails:</h3>
                    {classifiedEmails.map((email) => (
                        <div key={email.id} style={{ 
                            padding: '10px', 
                            margin: '10px 0', 
                            borderRadius: '5px', 
                            border: `1px solid ${getLabelColor(email.label)}`,
                            backgroundColor: '#1e1e1e' 
                        }}>
                            <p style={{ margin: '0', fontWeight: 'bold' }}>{email.label}</p>
                            <p style={{ margin: '5px 0 0 0' }}>{email.snippet}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );

    function getLabelColor(label) {
        switch (label) {
            case 'Important':
                return 'green';
            case 'Promotions':
                return 'orange';
            case 'Social':
                return 'blue';
            case 'Marketing':
                return 'yellow';
            case 'Spam':
                return 'red';
            case 'General':
            default:
                return 'white';
        }
    }
}

export default EmailClassifier;
