import React from 'react';
import { PickerModalProps, PickerModal } from './PickerModal';
import { darkly } from './darkly';

export const withPicker = <T extends React.ComponentType<any>>(
  Component: T,
) => {
  const Picker: React.FC<
    Omit<PickerModalProps, 'bgColor' | 'picker'> & React.ComponentProps<T>
  > = ({
    title,
    tintColor,
    confirmText,
    cancelText,
    onCancel,
    onConfirm,
    style,
    children,
    ...rest
  }) => {
    const picker = React.createElement(Component, rest);

    if (!children) return picker;

    return (
      <PickerModal
        title={title}
        cancelText={cancelText}
        confirmText={confirmText}
        onConfirm={onConfirm}
        onCancel={onCancel}
        tintColor={tintColor}
        style={style}
        bgColor={rest.overlayColor}
        picker={picker}>
        {children}
      </PickerModal>
    );
  };

  const DarklyPicker = darkly<
    React.FC<
      Omit<PickerModalProps, 'bgColor' | 'picker'> & React.ComponentProps<T>
    >,
    { darkTintColor?: string }
  >(Picker, ['tintColor']);

  // @ts-ignore
  DarklyPicker.defaultProps = {
    ...DarklyPicker.defaultProps,
    darkTintColor: '#1161c1',
  };

  return DarklyPicker;
};
