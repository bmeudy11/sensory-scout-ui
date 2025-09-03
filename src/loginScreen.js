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