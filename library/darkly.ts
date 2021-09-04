import React from 'react';
import { darkly as rnDarkly } from 'rn-darkly';

export const darkly = <T extends React.ComponentType<any>, E = {}>(
  Component: T,
  propKeys: (keyof React.ComponentProps<T>)[] = [],
) => {
  const DarkPicker = rnDarkly<
    T,
    {
      darkItemColor?: string;
      darkIndicatorColor?: string;
      darkOverlayColor?: string;
    } & E
  >(
    Component,
    [],
    propKeys.concat(['itemColor', 'indicatorColor', 'overlayColor']),
  );

  // @ts-ignore
  DarkPicker.defaultProps = {
    darkItemColor: '#e5e5e5',
    darkIndicatorColor: '#c5c5c5',
    darkOverlayColor: '#2b2b2b',
    indicatorColor: '#666',
    itemColor: '#333',
    overlayColor: '#fff',
  };

  return DarkPicker;
};
