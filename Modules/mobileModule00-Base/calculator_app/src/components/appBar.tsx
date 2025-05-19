import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import {theme} from 'styles/theme';

interface AppBarProps {
  title: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onLeftPress?: () => void;
  onRightPress?: () => void;
  backgroundColor?: string;
  titleColor?: string;
}

const AppBar: React.FC<AppBarProps> = ({
  title,
  leftIcon,
  rightIcon,
  onLeftPress,
  onRightPress,
  backgroundColor = theme.colors.primary,
  titleColor = '#FFFFFF',
}) => {
  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor,
        },
      ]}>
      <StatusBar backgroundColor={backgroundColor} barStyle="light-content" />
      <View style={styles.content}>
        {leftIcon ? (
          <TouchableOpacity style={styles.iconContainer} onPress={onLeftPress}>
            {leftIcon}
          </TouchableOpacity>
        ) : (
          <View style={styles.iconPlaceholder} />
        )}

        <Text style={[styles.title, {color: titleColor}]} numberOfLines={1}>
          {title}
        </Text>

        {rightIcon ? (
          <TouchableOpacity style={styles.iconContainer} onPress={onRightPress}>
            {rightIcon}
          </TouchableOpacity>
        ) : (
          <View style={styles.iconPlaceholder} />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 3,
    zIndex: 100,
  },
  content: {
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '500',
    flex: 1,
    textAlign: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconPlaceholder: {
    width: 40,
  },
});

export default AppBar;
