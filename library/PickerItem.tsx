import { Text } from 'react-native';
import * as React from 'react';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

type PickerItemProps = {
  height: number;
  fontSize: number;
  color: string;
  label: string | number;
  index: number;
  onPress: (index: number) => void;
};

export const PickerItem = React.memo<PickerItemProps>(function PickerItem({
  height,
  color,
  fontSize,
  label,
  index,
  onPress,
}) {
  return (
    <TouchableWithoutFeedback onPress={() => onPress(index)}>
      <Text
        style={{ fontSize, color, lineHeight: height, textAlign: 'center' }}>
        {label}
      </Text>
    </TouchableWithoutFeedback>
  );
});
