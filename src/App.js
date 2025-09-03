import React, { useState, useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native-web';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

import LoginScreen from './LoginScreen';
import MainContent from './MainContent';

export default function App() {
    const [userToken, setUserToken] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const bootstrapAsync = async () => {
            let token;
            try{
                //secure store does not work on web
                if (Platform.OS !== 'web'){
                    token = await SecureStore.getItemAsync('userToken');
                }else{
                    token = localStorage.getItem('userToken');
                }
                
            }catch(err){
                console.log('token capture failed', err);
            }

            setUserToken(token);
            setIsLoading(false);
        }
        bootstrapAsync();
    }, []);

    if (isLoading){
        return(
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <ActivityIndicator size='large'/>
            </View>
        );
    }

    const handleLoginSuccess = (token) => {
        setUserToken(token);
    };

    const handleLogout = async() => {
        //invalidate user token
        console.log('handlelogout called');

        if (Platform.OS !== 'web'){
            await SecureStore.deleteItemAsync('userToken');
        }else{
            localStorage.removeItem('userToken');
        }
        setUserToken(null);
    };

    console.log(`user token: ${userToken}`);

    return (
        <>
            {userToken == null ? (
                    //show login if token doesn't exist
                    <LoginScreen onLoginSuccess={handleLoginSuccess} />
                ) : (
                    //if token exists show main content
                    <MainContent token={userToken} onLogout={handleLogout} />
                )
            }
        </>
    );
};
