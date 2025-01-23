import { ActivityIndicator, Modal, View, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';

const Blur = ({ loading }: { loading: boolean }) => (
    <Modal transparent={true} animationType="fade" visible={loading}>
      <View style={styles.loaderContainer}>
        <BlurView
          style={styles.absolute}
          intensity={10} // Remplacez `blurType` par `intensity`
        >
          <ActivityIndicator size="large" color="green" />
        </BlurView>
      </View>
    </Modal>
  );
  
export default Blur;
  

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // semi-transparent black background
  },
  absolute: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    borderRadius: 10,
  },
}); 
