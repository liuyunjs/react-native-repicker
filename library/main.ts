import 'react-native-smart-modal';
import { darkly } from 'rn-darkly';
import { PickerViewCustom } from './PickerViewCustom';
import { withPicker } from './withPicker';
import { injectDefaultProps } from './defaultProps';

export const Picker = withPicker(PickerViewCustom);

export { PickerViewCustom, withPicker };

export const PickerView = darkly(
  PickerViewCustom,
  'overlayColor',
  'indicatorColor',
  'itemColor',
);

injectDefaultProps(Picker);
injectDefaultProps(PickerView);
