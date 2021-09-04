import 'react-native-smart-modal';
import { darkly } from './darkly';
import { withPicker } from './withPicker';
import { PickerView as RNPickerView } from './PickerView';

export const PickerView = darkly(RNPickerView);
export const Picker = withPicker(RNPickerView);
