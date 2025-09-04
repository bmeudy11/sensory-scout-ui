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
import { StyleSheet, Text, View, Button, TextInput, SafeAreaView, Alert, Modal, Dimensions, ScrollView } from 'react-native';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import StarRating from './StarRating';
import { TouchableOpacity } from 'react-native';
import { ActivityIndicator } from 'react-native-web';

const API_URL = 'http://localhost:3002';

export default function MainContent() {
    const [locations, setLocations] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [ratings, setRatings] = useState({});
    const [currentRatings, setCurrentRatings] = useState(null);
    const [isRatingsLoaded, setIsRatingsLoaded] = useState(false);
    
    // State for the new review form
    const [noise, setNoise] = useState(0);
    const [light, setLight] = useState(0);
    const [crowd, setCrowd] = useState(0);

    const [modalVisible, setModalVisible] = useState(false);
    const [modalMesssage, setModalMessage] = useState('');

    const deviceWidth = Dimensions.get('window').width;
    const deviceHeight = Dimensions.get('window').height;

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
            setLocations(response.data.details);
            setRatings(response.data.ratings);
        } catch (error) {
            console.error('Failed to fetch location data:', error);
            Alert.alert('Error', 'Could not load location data. Is the server running?');
        }
    };

    const fetchToken = async () => {
        let token;
        
        //secure store does not work on web
        if (Platform.OS !== 'web'){
            token = await SecureStore.getItemAsync('userToken');
        }else{
            token = localStorage.getItem('userToken');
        }
        return token;
    }

    const fetchLocations = async () => {
        try{
            const token = await fetchToken();

            const response = await axios.get(`${API_URL}/api/locations`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            setLocations(response.data);
        }catch(err){
            console.error('Error fetching locations', err.message);
            Alert.alert('Error', 'Could not fetch locations.');
        }
    }

    // useEffect runs this function once when the component loads
    useEffect(() => {
        console.log('useEffect fired');

        //fetchLocationData();
        fetchLocations();
    }, []);

    // Function to handle submitting a new review
    const handleSubmitReview = async () => {
        if(noise === 0 || light === 0 || crowd === 0){
            console.log('no rating selected.');
            if (Platform.OS === 'web'){
                setModalVisible(true);
                setModalMessage('Error: Plese select rating.');
            }else{
                Alert.alert("Missing Info", "Please fill out all rating fields.");
            }
            return;
        }

        const token = await fetchToken();

        try {
            await axios.post(`${API_URL}/api/reviews`,
                {
                    location_id: selectedLocation.id, // Hardcoded for this prototype
                    noise_level: noise,
                    light_level: light,
                    crowd_level: crowd,
                },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            Alert.alert("Success", "Your review has been submitted!");

            // Clear inputs and refresh data
            setNoise(0);
            setLight(0);
            setCrowd(0);
            //fetchLocationData();
            //setSelectedLocation(null);

            fetchRatingsForLocation(selectedLocation.id);

        } catch (error) {
            console.error("Failed to submit review:", error);
            Alert.alert("Error", "Could not submit review.");
        }
    };

    const fetchRatingsForLocation = async (locationId) => {
        const token = await fetchToken();
        setIsRatingsLoaded(true);

        try{
            const response = axios.get(`${API_URL}/api/locations/${locationId}`, 
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            setCurrentRatings((await response).data.ratings);
        }catch(err){
            console.error('Error fetching ratings', err.message);
            Alert.alert('Error', 'Could not fetch ratings.');
        }finally{
            setIsRatingsLoaded(false);
        }
    };

    const handleLocationSelect = async (location) => {
        setSelectedLocation(location);
        fetchRatingsForLocation(location.id);

        
    };

    const handleGoBackToList = () => {
        setSelectedLocation(null);
        setCurrentRatings(null);
        setNoise(0);
        setLight(0);
        setCrowd(0);
    };

  

    if (!selectedLocation){
        console.log('locations: ', locations);

        return (
            //LIST VIEW
            <SafeAreaView style={styles.container}>
                <Text style={styles.title}>Choose a Location</Text>
                <ScrollView style={styles.listContainer}>
                    {locations.map(location => (
                        <TouchableOpacity
                            key={location.id}
                            style={styles.locationItem}
                            onPress={() => handleLocationSelect(location)}
                        >
                            <Text style={styles.locationName}>{location.name}</Text>
                        </TouchableOpacity>    
                    ))}
                </ScrollView>
            </SafeAreaView>
        );
    }else{
        return(
            // RATING View
            <SafeAreaView style={styles.container}>
            {locations ? (
                <>
                <Text style={styles.title}>{selectedLocation.name}</Text>
                <Text style={styles.address}>{selectedLocation.address}</Text>

                <View style={styles.currentRatingsContainer}>
                    <Text style={styles.formTitle}>Current Average Ratings</Text>
                    {isRatingsLoaded ? (
                        <ActivityIndicator size="large" color="#0000ff" />
                    ) : currentRatings && currentRatings.noise ? (
                        <>
                            <Text style={styles.ratingText}>🎧 Noise: {currentRatings.noise} / 5</Text>
                            <Text style={styles.ratingText}>💡 Light: {currentRatings.light} / 5</Text>
                            <Text style={styles.ratingText}>👥 Crowd: {currentRatings.crowd} / 5</Text>
                        </>
                    ) : (
                        <Text>Be the first to rate this location!</Text>
                    )}
                </View>
                
                <View style={styles.formContainer}>
                    <Text style={styles.formTitle}>Submit Your Rating (1-5)</Text>
                    <View style={styles.ratingRow}>
                        <Text style={styles.ratingLabel}>Noise:</Text>
                        <StarRating rating={noise} onRatingChange={setNoise}/>
                    </View>
                    <View style={styles.ratingRow}>
                        <Text style={styles.ratingLabel}>Light:</Text>
                        <StarRating rating={light} onRatingChange={setLight}/>
                    </View>
                    <View style={styles.ratingRow}>
                        <Text style={styles.ratingLabel}>Crowd:</Text>
                        <StarRating rating={crowd} onRatingChange={setCrowd}/>
                    </View>
                    <Button title="Submit Review" onPress={handleSubmitReview} />
                    <View style={{marginTop: 20}}>
                        <Button title="Back" onPress={() => setSelectedLocation(null)} color="gray"/>
                    </View>

                    <Modal
                        animationType="slide" // or "fade", "none"
                        transparent={true} // or false
                        visible={modalVisible}
                        onRequestClose={() => setModalVisible(false)} 
                    >
                        <View style={[styles.modal, {width: deviceWidth * .9}, {height: deviceHeight *.2}]}>
                            <View style={styles.modalContent}>
                                <Text>{modalMesssage}</Text>
                                <Button title="OK" onPress={() => setModalVisible(false)} />
                            </View>
                        </View>
                    </Modal>
                </View>
                </>
            ) : (
                <Text>Loading location...</Text>
            )}
            </SafeAreaView>
        );
    }
}

// Basic styling
const styles = StyleSheet.create({
    container: { flex: 1, alignItems: 'center', marginTop: 50, paddingHorizontal: 20 },
    title: { fontSize: 28, fontWeight: 'bold', marginBottom: 5, textAlign: 'center'},
    address: { fontSize: 16, color: 'gray', marginBottom: 20 },
    ratingsContainer: { marginBottom: 30, alignItems: 'flex-start' },
    ratingText: { fontSize: 20, marginBottom: 10 },
    formContainer: { width: '100%', borderTopWidth: 1, borderColor: '#ccc', paddingTop: 20, marginTop: 20 },
    formTitle: { fontSize: 22, fontWeight: '600', textAlign: 'center', marginBottom: 15 },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 10,
        width: '100%',
    },
    modal: {backgroundColor: 'gray', alignSelf: 'center', marginTop: 40, padding: 20},
    ratingRow: {alignItems: 'center', marginBottom: 10},
    ratingLabel: {fontSize: 18, fontWeight: '500', marginBottom: 5},
    listContainer: {width: '90%'},
    locationItem: {
        padding: 20, 
        backgroundColor: '#f8f8f8',
        borderBottomWidth: 1,
        borderColor: '#eee',
    },
    locationName: {fontSize: 18},
    currentRatingsContainer: {
        width: '100%',
        aligntItems: 'center', 
        padding: 15,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
    },
    ratingText: {
        fontSize: 16,
        marginBottom: 5,
    },
    formContainer: {width: '90%', paddingTop: 20, alignItems: 'center'},
});