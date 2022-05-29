import * as React from 'react';
import { PickerModalProps, PickerModal } from './PickerModal';

export const withPicker = <T extends object>(
  PickerView: React.ComponentType<T>,
) => {
  const Picker: React.FC<Omit<PickerModalProps, 'bgColor' | 'picker'> & T> = ({
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
    const picker = React.createElement(PickerView, rest as T);

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
        // @ts-ignore
        bgColor={rest.overlayColor}
        forceDark={rest.forceDark}
        picker={picker}>
        {children}
      </PickerModal>
    );
  };

  return Picker;
};
