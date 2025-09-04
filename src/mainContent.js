/*import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, Alert, Text } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

export default function MainContent(){
    const [userToken, setUserToken] = useState(null);

    const handleLogout = async() => {
        console.log('logout called');
        //invalidate user token
        
        if (Platform.OS !== 'web'){
            await SecureStore.deleteItemAsync('userToken');
        }else{
            await localStorage.removeItem('userToken');
        }
        setUserToken(null);

        console.log('user token: ', userToken);
    };
    
    return(
        <View>
            <Button title="Logout" onPress={handleLogout}/>
        </View>
    );
};
*/

import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, TextInput, SafeAreaView, Alert } from 'react-native';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const API_URL = 'http://localhost:3002';

export default function App() {
  const [location, setLocation] = useState(null);
  const [ratings, setRatings] = useState({});
  
  // State for the new review form
  const [noise, setNoise] = useState('');
  const [light, setLight] = useState('');
  const [crowd, setCrowd] = useState('');

  const [userToken, setUserToken] = useState(null);

  // Function to fetch data from the backend
  const fetchLocationData = async () => {
        try {
            console.log('Start location fetch...');

            // For this prototype, we'll hardcode fetching location with ID 1
            let token;

            //secure store does not work on web
            if (Platform.OS !== 'web'){
                token = await SecureStore.getItemAsync('userToken');
            }else{
                token = localStorage.getItem('userToken');
            }

            const response = await axios.get(`${API_URL}/api/locations/1`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setLocation(response.data.details);
            setRatings(response.data.ratings);
        } catch (error) {
            console.error("Failed to fetch location data:", error);
            Alert.alert("Error", "Could not load location data. Is the server running?");
        }
  };

  // useEffect runs this function once when the component loads
  useEffect(() => {
    fetchLocationData();
  }, []);

  // Function to handle submitting a new review
  const handleSubmitReview = async () => {
        if (!noise || !light || !crowd) {
            Alert.alert("Missing Info", "Please fill out all rating fields.");
            return;
        }

        try {
            await axios.post(`${API_URL}/api/reviews`, {
                location_id: 1, // Hardcoded for this prototype
                noise_level: parseInt(noise, 10),
                light_level: parseInt(light, 10),
                crowd_level: parseInt(crowd, 10),
            });

            Alert.alert("Success", "Your review has been submitted!");

            // Clear inputs and refresh data
            setNoise('');
            setLight('');
            setCrowd('');
            fetchLocationData();
        } catch (error) {
            console.error("Failed to submit review:", error);
            Alert.alert("Error", "Could not submit review.");
        }
  };

  return (
    <SafeAreaView style={styles.container}>
      {location ? (
        <>
          <Text style={styles.title}>{location.name}</Text>
          <Text style={styles.address}>{location.address}</Text>

          <View style={styles.ratingsContainer}>
            <Text style={styles.ratingText}>🎧 Noise: {ratings.noise} / 5</Text>
            <Text style={styles.ratingText}>💡 Light: {ratings.light} / 5</Text>
            <Text style={styles.ratingText}>👥 Crowd: {ratings.crowd} / 5</Text>
          </View>
          
          <View style={styles.formContainer}>
            <Text style={styles.formTitle}>Submit Your Rating (1-5)</Text>
            <TextInput
              style={styles.input}
              placeholder="Noise Level (1-5)"
              value={noise}
              onChangeText={setNoise}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="Light Level (1-5)"
              value={light}
              onChangeText={setLight}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="Crowd Level (1-5)"
              value={crowd}
              onChangeText={setCrowd}
              keyboardType="numeric"
            />
            <Button title="Submit Review" onPress={handleSubmitReview} />
          </View>
        </>
      ) : (
        <Text>Loading location...</Text>
      )}
    </SafeAreaView>
  );
}

// Basic styling
const styles = StyleSheet.create({
    container: { flex: 1, alignItems: 'center', marginTop: 50, paddingHorizontal: 20 },
    title: { fontSize: 28, fontWeight: 'bold', marginBottom: 5 },
    address: { fontSize: 16, color: 'gray', marginBottom: 20 },
    ratingsContainer: { marginBottom: 30, alignItems: 'flex-start' },
    ratingText: { fontSize: 20, marginBottom: 10 },
    formContainer: { width: '100%', borderTopWidth: 1, borderColor: '#ccc', paddingTop: 20 },
    formTitle: { fontSize: 22, fontWeight: '600', textAlign: 'center', marginBottom: 15 },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 10,
        width: '100%',
    },
});