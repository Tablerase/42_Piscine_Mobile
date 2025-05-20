import {View, StyleSheet} from 'react-native';
import {BottomBar} from '@components/BottomBar';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import {Forecast} from '@components/Forecast';
import {SearchBar} from '@components/SearchBar';
import {Page, useAppContext} from '@contexts/AppContext';
import {SearchList} from '@components/SearchList';

const Main = () => {
  const {page, setPage, citySearchStatus} = useAppContext();

  const PAGES = [Page.Currently, Page.Today, Page.Weekly];
  const SWIPE_DISTANCE_THRESHOLD = 100;

  const swipPanGesture = Gesture.Pan().onEnd(event => {
    const currentIndex = PAGES.indexOf(page);
    const {translationX} = event;

    if (translationX > SWIPE_DISTANCE_THRESHOLD) {
      // Swipe Left
      if (currentIndex > 0) {
        setPage(PAGES[currentIndex - 1]);
      }
    } else if (translationX < -SWIPE_DISTANCE_THRESHOLD) {
      // Swipe Right
      if (currentIndex < PAGES.length - 1) {
        setPage(PAGES[currentIndex + 1]);
      }
    }
  });

  return (
    <>
      <SearchBar />
      <GestureDetector gesture={swipPanGesture}>
        <View style={styles.container}>
          {citySearchStatus === false ? <Forecast /> : <SearchList />}
        </View>
      </GestureDetector>
      <BottomBar page={page} setPage={newPage => setPage(newPage as Page)} />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
});

export default Main;
