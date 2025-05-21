import {
  View,
  StyleSheet,
  ImageBackground,
  LayoutChangeEvent,
} from 'react-native';
import {BottomBar} from '@components/BottomBar';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import {Forecast} from '@components/Forecast';
import {SearchBar} from '@components/SearchBar';
import {Page, useAppContext} from '@contexts/AppContext';
import {SearchList} from '@components/SearchList';
import {useEffect, useState} from 'react';

const backgroundImage = require('@assets/sky_and_clouds_mistal.jpg');
// const backgroundImage = require('@assets/landscape_mistral.jpg');

const Main = () => {
  const {page, setPage, citySearchStatus, setDirection, setDimension} =
    useAppContext();
  const [containerWidth, setContainerWidth] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);

  useEffect(() => {
    if (containerHeight >= containerWidth) {
      setDirection('column');
    } else {
      setDirection('row');
    }
  }, [containerWidth, containerHeight, setDirection]);

  const handleLayout = (event: LayoutChangeEvent) => {
    const {width} = event.nativeEvent.layout;
    const {height} = event.nativeEvent.layout;
    setContainerWidth(width);
    setContainerHeight(height);
    setDimension({width: width, height: height});
  };

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
      <ImageBackground style={styles.background} source={backgroundImage}>
        <SearchBar />
        <GestureDetector gesture={swipPanGesture}>
          <View style={styles.container} onLayout={handleLayout}>
            {citySearchStatus === false ? <Forecast /> : <SearchList />}
          </View>
        </GestureDetector>
        <BottomBar page={page} setPage={newPage => setPage(newPage as Page)} />
      </ImageBackground>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  background: {
    flex: 1,
  },
});

export default Main;
