import { Text } from 'react-native';
import React from 'react';

type PickerItemProps = {
  height: number;
  fontSize: number;
  color: string;
  label: string | number;
};

export const PickerItem = React.memo<PickerItemProps>(function PickerItem({
  height,
  color,
  fontSize,
  label,
}) {
  return (
    <Text style={{ fontSize, color, lineHeight: height, textAlign: 'center' }}>
      {label}
    </Text>
  );
});
