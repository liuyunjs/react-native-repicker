import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { PickerHeader, PickerHeaderProps } from './PickerHeader';

export type PickerContainerProps = PickerHeaderProps & {
  bgColor?: string;
  style?: StyleProp<ViewStyle>;
};

export const PickerContainer: React.FC<PickerContainerProps> = ({
  children,
  bgColor,
  style,
  ...rest
}) => {
  const header = React.createElement(PickerHeader, rest);
  return (
    <View style={[styles.container, style, { backgroundColor: bgColor }]}>
      {header}
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },

  header: {
    height: 60,
    flexDirection: 'row',
  },

  btnText: {
    fontSize: 14,
    color: '#666',
  },

  darkCancelText: {
    color: '#aaa',
  },

  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: '500',
    color: '#333',
  },

  darkTitle: {
    color: '#ddd',
  },
});
