import 'react-native-smart-modal';
import { darkly as darkly } from 'rn-darkly';
import { PickerViewCustom } from './PickerViewCustom';
import { withPicker } from './withPicker';

export { PickerViewCustom };

const PickerInternal = withPicker(PickerViewCustom);

export const PickerView = darkly(
  PickerViewCustom,
  'overlayColor',
  'indicatorColor',
  'itemColor',
);
export const Picker = darkly(
  PickerInternal,
  'overlayColor',
  'indicatorColor',
  'itemColor',
  'tintColor',
);

PickerView.defaultProps = {
  dark_itemColor: '#e5e5e5',
  dark_indicatorColor: '#c5c5c5',
  dark_overlayColor: '#2b2b2b',
};

Picker.defaultProps = {
  ...PickerView.defaultProps,
  dark_tintColor: '#1161c1',
};
