import React, { useState } from 'react';
import * as SecureStore from 'expo-secure-store';

import loginScreen from './loginScreen';
import mainContent from './mainContent';

export default function App() {
    const [userToken, setUserToken] = useState(null);

    const handleLoginSuccess = (token) => {
        setUserToken(token);
    };

    const handleLogout = async() => {
        //invalidate user token
        await SecureStore.deleteItemAsync('userToken');
        setUserToken(null);
    };

    return (
        <>
            {userToken == null ? (
                    //show login if token doesn't exist
                    <loginScreen onLoginSuccess={handleLoginSuccess} />
                ) : (
                    //if token exists show main content
                    <mainContent token={userToken} onLogout={handleLogout} />
                )
            }
        </>
    );
};
