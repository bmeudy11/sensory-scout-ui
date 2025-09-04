import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet, Image } from 'react-native';

const StarRating = ({rating, onRatingChange, maxStars=5}) => {
    //generate a view that shows stars the user can click
    return(
        <View style={styles.container}>
            {[...Array(maxStars)].map((_, index) => {
                const starValue = index + 1;
                return(
                    <TouchableOpacity
                        key={starValue}
                        onPress={() => onRatingChange(starValue)}
                    >
                        <Image
                            style={styles.star}
                            source={
                                starValue <= rating 
                                ? require('./images/star-filled.png') 
                                : require('./images/star-unfilled.png')
                            }
                        />
                    </TouchableOpacity>
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    star: {
        fontSize: 80,
        marginHorizontal: 5,
        width: 40,
        height: 40,
    },
});

export default StarRating;