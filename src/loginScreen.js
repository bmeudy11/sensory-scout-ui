import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert, Text } from 'react-native';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

//url for sensory-scout-api
const apiURl = 'http://localhost:3002';

export default function loginScreen({ onLoginSuccess }){
    //use built in react hook to store email and password
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        try{
            const response = await axios.post(`${apiURl/api/auth/login}`, {email, password});
            const {token} = response.data;

            await SecureStore.setItemAsync('userToken', token);
            Alert.alert('Login Success', 'You are now logged in.');
            onLoginSuccess(token); 
        }catch(err){
            console.error(err.message);
            Alert.alert('Error', err.message);
        }
    };

    const hanleRegister = async () => {

    };

    return(
        <html/>
    );
}

//create stylesheet
const styleSheet = StyleSheet.create({
    
});