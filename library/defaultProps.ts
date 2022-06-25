import * as React from 'react';

export const injectDefaultProps = (Component: React.ComponentType<any>) => {
  Component.defaultProps = {
    dark_itemColor: '#e5e5e5',
    dark_indicatorColor: '#c5c5c5',
    dark_overlayColor: '#2b2b2b',
    indicatorColor: '#666',
    itemColor: '#333',
    overlayColor: '#fff',
    dark_tintColor: '#1161c1',
    tintColor: '#1073ea',
  };
};
