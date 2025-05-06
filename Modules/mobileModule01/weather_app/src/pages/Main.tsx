import {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {Text} from 'react-native';
import {BottomBar} from '@components/BottomBar';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';

const Main = () => {
  const [page, setPage] = useState('Currently');
  // const [location, setLocation] = React.useState('Paris');
  // const [unit, setUnit] = React.useState('metric');
  // const [weatherData, setWeatherData] = React.useState(null);

  const PAGES = ['Currently', 'Today', 'Weekly'];
  const SWIPE_DISTANCE_THRESHOLD = 100;

  const swipPanGesture = Gesture.Pan().onEnd(event => {
    const currentIndex = PAGES.indexOf(page);
    const {translationX} = event;
    if (translationX < SWIPE_DISTANCE_THRESHOLD) {
      // Swipe Right
      if (currentIndex < PAGES.length - 1) {
        setPage(PAGES[currentIndex + 1]);
      }
    } else if (translationX > -SWIPE_DISTANCE_THRESHOLD) {
      // Swipe Left
      if (currentIndex > 0) {
        setPage(PAGES[currentIndex - 1]);
      }
    }
  });

  return (
    <>
      <GestureDetector gesture={swipPanGesture}>
        <View style={styles.container}>
          <Text>Hello, this is the Main component of the weather app!</Text>
          {page === 'Currently' && (
            <View style={styles.currently}>
              <Text>Current Weather Page</Text>
            </View>
          )}
          {page === 'Today' && (
            <View style={styles.today}>
              <Text>Toda Forecast Page</Text>
            </View>
          )}
          {page === 'Weekly' && (
            <View style={styles.weekly}>
              <Text>Weekly Forecast Page</Text>
            </View>
          )}
        </View>
      </GestureDetector>
      <BottomBar page={page} setPage={setPage} />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  currently: {
    backgroundColor: 'orange',
    height: '100%',
    width: '100%',
  },
  today: {
    backgroundColor: 'cyan',
    height: '100%',
    width: '100%',
  },
  weekly: {
    backgroundColor: 'purple',
    height: '100%',
    width: '100%',
  },
});

export default Main;
