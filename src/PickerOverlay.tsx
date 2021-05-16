import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import { StyleSheet, View, ColorValue } from 'react-native';
import colorUtil from 'color';

const OverlayGradient = React.memo<{
  y: number;
  color: string;
  height: number;
}>(({ y, color, height }) => {
  const colors = [color, colorUtil(color, 'hex').fade(1).toString()];
  if (y) colors.reverse();
  return (
    <LinearGradient
      colors={colors}
      style={[styles.gradient, { height, top: y }]}
    />
  );
});

const OverlayLine: React.FC<{
  y: number;
  color: ColorValue;
}> = ({ y, color }) => {
  return (
    <View
      style={[
        styles.line,
        {
          borderTopColor: color,
          top: y,
        },
      ]}
    />
  );
};

export const PickerOverlay = React.memo<{
  height: number;
  total: number;
  dark: boolean;
}>(({ height, total, dark: isDark }) => {
  const halfHeight = height * total;
  const gradientHeight = halfHeight + height * 0.5;
  const bottomPosition = halfHeight + height;

  const gradientColor = isDark ? '#000' : '#fff';
  const strokeColor = isDark ? '#fff' : '#000';

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <OverlayGradient color={gradientColor} y={0} height={gradientHeight} />
      <OverlayGradient
        color={gradientColor}
        y={gradientHeight}
        height={gradientHeight}
      />
      <OverlayLine y={halfHeight} color={strokeColor} />
      <OverlayLine y={bottomPosition} color={strokeColor} />
    </View>
  );
});

const styles = StyleSheet.create({
  line: {
    height: 0,
    position: 'absolute',
    left: 0,
    right: 0,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
  },
});
