const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { google } = require('googleapis');
const dotenv = require('dotenv');
const cors = require('cors');
const OpenAI = require('openai-api');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.json({ limit: '50mb' }));

let openaiInstance = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Passport Google OAuth setup
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:5000/auth/google/callback"
},
    (accessToken, refreshToken, profile, done) => {
        return done(null, { profile, accessToken, refreshToken });
    }
));

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

app.use(passport.initialize());

app.get('/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email', 'https://www.googleapis.com/auth/gmail.readonly'] })
);

app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/' }),
    (req, res) => {
        res.redirect('http://localhost:3000');
    }
);

const oAuth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    "http://localhost:5000/auth/google/callback"
);

app.post('/fetch-emails', async (req, res) => {
    const { tokens } = req.body;

    oAuth2Client.setCredentials(tokens);
    const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });

    try {
        const result = await gmail.users.messages.list({
            userId: 'me',
            maxResults: 10,
        });

        const emails = await Promise.all(result.data.messages.map(async (msg) => {
            const email = await gmail.users.messages.get({
                userId: 'me',
                id: msg.id,
            });
            return email.data;
        }));

        res.json(emails);
    } catch (error) {
        console.error('Error fetching emails:', error);
        res.status(500).send('Error fetching emails.');
    }
});

app.post('/classify-emails', async (req, res) => {
    try {
        const { emails } = req.body;

        if (!emails || !Array.isArray(emails)) {
            return res.status(400).json({ error: 'Invalid request body. Expected an array of emails.' });
        }

        const classifications = await Promise.all(emails.map(async (email) => {
            try {
                const response = await openaiInstance.complete({
                    engine: 'text-davinci-002',
                    prompt: `Classify the following email into one of the categories: Important, Promotions, Social, Marketing, Spam, General.\n\nEmail: ${email.snippet}\n\nCategory:`,
                    max_tokens: 10,
                });

                const label = response.data.choices[0].text.trim();

                return { ...email, label };
            } catch (error) {
                console.error('Error classifying email:', error);
                return { ...email, label: 'General' };
            }
        }));

        res.json(classifications);
    } catch (error) {
        console.error('Error classifying emails:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
