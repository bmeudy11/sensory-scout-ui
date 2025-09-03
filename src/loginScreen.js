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

    const handleRegister = async () => {
        try{
            await axios.post(`${apiURl}/api/auth/register`, {email, password});
            Alert.alert('Registration successful', 'Proceed to log in.');
        }catch(err){
            console.error(err.message);
            Alert.alert('Error', err.message);
        }
    };

    return(
        <View style={StyleSheet.container}>
            <Text style={styleSheet.title}>SensoryScout</Text>
            <TextInput
                style={styleSheet.input}
                placeholder='Email'
                value={email}
                onChangeText={setEmail}
                autoCapitalize='none'
                keyboardType='email-address'
            />
            <TextInput
                style={styleSheet.input}
                placeholder='Password'
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            <View style={styleSheet.buttonContainer}>
                <Button title="Login" onPress={handleLogin}/>
                <Button title="Register" onPress={handleRegister} color="#841584"/>
            </View>
        </View>
    );
}

//create stylesheet
const styleSheet = StyleSheet.create({
    container: {flex: 1, justifyContent: 'center', padding: 20},
    title: {fontSize: 32, fontWeight: 'bold', textAlign: 'center', marginBottom: 40},
    input: {height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 12, padding: 10},
    buttonContainer: {flexDirection: 'row', justifyContent: 'space-around', marginTop: 20},
});