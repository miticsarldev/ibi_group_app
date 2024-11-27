import React, { useEffect } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';

const SplashScreen = () => {
  const navigation = useNavigation();
  const translateX = useSharedValue(-500); 

  useEffect(() => {
    // Animation pour faire entrer la voiture au centre
    translateX.value = withTiming(0, { duration: 1000 });

    // Naviguer vers l'écran Onboarding après 5 secondes
    const timer = setTimeout(() => {
      navigation.replace('Onboarding/Onboarding');
    }, 5000);

    return () => clearTimeout(timer);
  }, []);


  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <View style={styles.container}>
      <Image source={require('../assets/image/Logo.png')} style={styles.logo} />
      <Animated.Image
        source={require('../assets/image/voiture.png')}
        style={[styles.car, animatedStyle]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#52D5BA',
  },
  logo: {
    width: 250,
    height: 200,
    marginBottom: 10,
  },
  car: {
    width: 250,
    height: 200,
    position: 'absolute',
    bottom: 30, 
  },
});

export default SplashScreen;
