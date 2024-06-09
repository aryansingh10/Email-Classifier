import React, { useEffect } from 'react';
import axios from 'axios';

const EmailFetcher = ({ googleToken, apiKey, setEmails }) => {
    useEffect(() => {
        const fetchEmails = async () => {
            try {
                console.log('Fetching emails with tokens:', googleToken, 'and API key:', apiKey);

                const response = await axios.post('http://localhost:5000/fetch-emails', {
                    tokens: googleToken,
                    openAiKey: apiKey,
                });

               console.log('Fetched emails:', response.data);
                setEmails(response.data);
            } catch (error) {
                console.error('Error fetching emails:', error.response ? error.response.data : error.message);
            }
        };

        if (googleToken && apiKey) {
            fetchEmails();
        }
    }, [googleToken, apiKey, setEmails]);

    return <div></div>;
};

export default EmailFetcher;
