import {theme} from '@styles/theme';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface BottomBarProps {
  page: string;
  setPage: (page: string) => void;
}

export const BottomBar = ({page, setPage}: BottomBarProps) => {
  const iconSize = 20;

  return (
    <>
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.tabButton}
          onPress={() => setPage('Currently')}>
          <Icon
            name="clock-time-eight"
            size={iconSize}
            color={
              page === 'Currently' ? styles.textActive.color : styles.text.color
            }
          />
          <Text style={page === 'Currently' ? styles.textActive : styles.text}>
            Currently
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.tabButton}
          onPress={() => setPage('Today')}>
          <Icon
            name="calendar-today"
            size={iconSize}
            color={
              page === 'Today' ? styles.textActive.color : styles.text.color
            }
          />
          <Text style={page === 'Today' ? styles.textActive : styles.text}>
            Today
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.tabButton}
          onPress={() => setPage('Weekly')}>
          <Icon
            name="calendar-week"
            size={iconSize}
            color={
              page === 'Weekly' ? styles.textActive.color : styles.text.color
            }
          />
          <Text style={page === 'Weekly' ? styles.textActive : styles.text}>
            Weekly
          </Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    height: 50,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    fontSize: theme.fontSizes.medium,
  },
  text: {
    color: theme.colors.text.primary,
  },
  textActive: {
    color: theme.colors.text.secondary,
    fontWeight: 'bold',
  },
});
