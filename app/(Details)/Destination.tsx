import { View, Text, Image ,TouchableOpacity} from 'react-native';
import React from 'react';
import { router } from 'expo-router';

const Destination = () => {
    const handleNext = () => {
        // router.navigate('/Home'); 
      };
  return (
    <View>
       <TouchableOpacity onPress={handleNext}>

      <Image source={require('../../assets/image/Home.png')}  />
      </TouchableOpacity>
    </View>
  )
}

export default Destination;