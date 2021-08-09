import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import { StyleSheet, View, ColorValue, processColor } from 'react-native';

function red(c: number) {
  return (c >> 16) & 255;
}
function green(c: number) {
  return (c >> 8) & 255;
}
function blue(c: number) {
  return c & 255;
}

const OverlayGradient: React.FC<{
  y: number;
  color: string;
  height: number;
}> = ({ y, color, height }) => {
  const c = processColor(color) as number;

  const colors = [color, `rgba(${red(c)}, ${green(c)}, ${blue(c)}, 0)`];
  if (y) colors.reverse();
  return (
    <LinearGradient
      colors={colors}
      style={[styles.gradient, { height, top: y }]}
    />
  );
};

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
  indicatorColor: string;
  overlayColor: string;
}>(function PickerOverlay({ height, indicatorColor, total, overlayColor }) {
  const halfHeight = height * total;
  const gradientHeight = halfHeight + height * 0.5;
  const bottomPosition = halfHeight + height;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <OverlayGradient color={overlayColor} y={0} height={gradientHeight} />
      <OverlayGradient
        color={overlayColor}
        y={gradientHeight}
        height={gradientHeight}
      />
      <OverlayLine y={halfHeight} color={indicatorColor} />
      <OverlayLine y={bottomPosition} color={indicatorColor} />
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
