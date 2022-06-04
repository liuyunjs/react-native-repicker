import 'react-native-smart-modal';
import { PickerViewCustom } from './PickerViewCustom';
import { withPicker } from './withPicker';

export { PickerViewCustom, withPicker };

export const Picker = withPicker(PickerViewCustom);

export const PickerView = PickerViewCustom;

Picker.defaultProps = {
  ...PickerView.defaultProps,
  tintColor: '#1073ea',
};
