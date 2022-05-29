import * as React from 'react';
import { PickerModalProps, PickerModal } from './PickerModal';
import { PickerViewCustom, PickerViewCustomProps } from './PickerViewCustom';

export const Picker: React.FC<
  Omit<PickerModalProps, 'bgColor' | 'picker'> & PickerViewCustomProps
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
  const picker = React.createElement(PickerViewCustom, rest);

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
      forceDark={rest.forceDark}
      picker={picker}>
      {children}
    </PickerModal>
  );
};
