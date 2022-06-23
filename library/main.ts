import 'react-native-smart-modal';
import { darkly } from 'rn-darkly';
import { PickerViewCustom } from './PickerViewCustom';
import { ModalPicker } from './ModalPicker';
import { withPicker } from './withPicker';

const DarklyModalPicker = darkly(
  ModalPicker,
  'style',
  'indicatorColor',
  'itemColor',
  'maskBackgroundColor',
  'containerStyle',
  'contentContainerStyle',
  'tintColor',
  'overlayColor',
);

export const Picker = withPicker(DarklyModalPicker);

export { PickerViewCustom, withPicker };

export const PickerView = darkly(
  PickerViewCustom,
  'overlayColor',
  'indicatorColor',
  'itemColor',
);

const defaultProps = {
  dark_itemColor: '#e5e5e5',
  dark_indicatorColor: '#c5c5c5',
  dark_overlayColor: '#2b2b2b',
  indicatorColor: '#666',
  itemColor: '#333',
  overlayColor: '#fff',
};

PickerView.defaultProps = defaultProps;

DarklyModalPicker.defaultProps = Picker.defaultProps = {
  ...defaultProps,
  dark_tintColor: '#1161c1',
  tintColor: '#1073ea',
};
