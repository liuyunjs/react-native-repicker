import 'react-native-smart-modal';
import { darkly } from 'rn-darkly';
import { PickerViewCustom } from './PickerViewCustom';
import { withPicker } from './withPicker';

export { PickerViewCustom, withPicker };

export const PickerView = darkly(
  PickerViewCustom,
  'overlayColor',
  'indicatorColor',
  'itemColor',
);
const PickerInternal = withPicker(PickerView);

export const Picker = darkly(PickerInternal, 'tintColor');

PickerView.defaultProps = {
  dark_itemColor: '#e5e5e5',
  dark_indicatorColor: '#c5c5c5',
  dark_overlayColor: '#2b2b2b',
  indicatorColor: '#666',
  itemColor: '#333',
  overlayColor: '#fff',
};

Picker.defaultProps = {
  ...PickerView.defaultProps,
  dark_tintColor: '#1161c1',
  tintColor: '#1073ea',
};
