import React from 'react';
import { darkly } from 'rn-darkly';

import { Picker as RPicker } from './Picker';

let Picker = darkly<
  React.ComponentType<React.ComponentProps<typeof RPicker>>,
  {
    darkItemColor?: string;
    darkIndicatorColor?: string;
    darkOverlayColor?: string;
  }
>(RPicker, [], ['itemColor', 'indicatorColor', 'overlayColor']);

Picker.defaultProps = {
  darkItemColor: '#eee',
  darkIndicatorColor: '#ccc',
  darkOverlayColor: '#000',
};

Picker = React.memo(Picker);

export { Picker };
