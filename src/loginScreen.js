import React, { useState } from 'react';
import { 
    Dimensions, 
    View, 
    TextInput, 
    Button, 
    StyleSheet, 
    Alert, 
    Text, 
    Modal, 
    ImageBackground, 
    KeyboardAvoidingView 
} from 'react-native';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

//url for sensory-scout-api
const apiURl = 'http://localhost:3002';

export default function LoginScreen({ onLoginSuccess }){
    //use built in react hook to store email and password
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [modalMesssage, setModalMessage] = useState('');

    const deviceWidth = Dimensions.get('window').width;
    const deviceHeight = Dimensions.get('window').height;

    const handleLogin = async () => {
        console.log('handleLogin');
        try{
            const response = await axios.post(`${apiURl}/api/auth/login`, {email, password});

            const {token} = response.data;

            //secure store does not work on web
            if (Platform.OS !== 'web'){
                await SecureStore.setItemAsync('userToken', token);
            }else{
                localStorage.setItem('userToken', token);
            }
         
            Alert.alert('Login Success', 'You are now logged in.');
            onLoginSuccess(token); 
        }catch(err){
            console.log('Catch Error: ', err.message);
            Alert.alert('Error', err.message);
            setModalVisible(true);
            setModalMessage(`Error: ${err.message}`);
        }
    };

    const handleRegister = async () => {
        try{
            await axios.post(`${apiURl}/api/auth/register`, {email, password});
            Alert.alert('Registration successful', 'Proceed to log in.');
            setModalVisible(true);
            setModalMessage('Registration Successful.')
        }catch(err){
            console.error(err.message);
            Alert.alert('Error: ', err.message);
            setModalVisible(true);
            setModalMessage(`Error: ${err.message}`);
        }
    };

    return(
        
            <View style={styleSheet.rootContainer}>

                <ImageBackground
                            source={require('./images/SensoryScout.png')}
                            resizeMode='contain'
                            style={styleSheet.background}
                />
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styleSheet.keyboardAvoidingContainer}>
                    
                    <View style={styleSheet.formContainer}>
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
                            <Button style={styleSheet.button} title="Login" onPress={handleLogin}/>
                            <Button style={styleSheet.button} title="Register" onPress={handleRegister} color="#841584"/>
                        </View>

                        <Modal
                            animationType="slide" // or "fade", "none"
                            transparent={true} // or false
                            visible={modalVisible}
                            onRequestClose={() => setModalVisible(false)} 
                        >
                            <View style={[styleSheet.modal, {width: deviceWidth * .9}, {height: deviceHeight *.2}]}>
                                <View style={styleSheet.modalContent}>
                                    <Text>{modalMesssage}</Text>
                                    <Button title="OK" onPress={() => setModalVisible(false)} />
                                </View>
                            </View>
                        </Modal>
                    </View>
                </KeyboardAvoidingView>
            </View>
    );
}

//create stylesheet
const styleSheet = StyleSheet.create({
    container: {flex: 1, justifyContent: 'center', padding: 20,},
    rootContainer: {flex: 1},
    title: {fontSize: 32, fontWeight: 'bold', textAlign: 'center', marginBottom: 40},
    input: {height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 12, padding: 10, borderRadius: 5},
    buttonContainer: {flexDirection: 'row', justifyContent: 'space-around', marginTop: 20},
    modal: {backgroundColor: 'gray', alignSelf: 'center', marginTop: 40, padding: 20},
    //background: {flex: 1, justifyContent: 'center', opacity: 1},
    background: {position: 'absolute', top: 0, left: 0, bottom: 0, right: 0, opacity: 0.6},
    keyboardAvoidingContainer: {
        flex: 1,
        justifyContent: 'center', 
        alignItems: 'center', 
        backgroundColor: 'rgba(0,0.0.0.3)',
    },
    button: {borderRadius: 5}
});