import * as React from 'react';
import { withModal } from 'react-native-smart-modal';
import { ComposeModalProps } from 'react-native-smart-modal/dist/types';
import { useReactionState } from '@liuyunjs/hooks/lib/useReactionState';

export const withPicker = <T extends object>(
  PickerView: React.ComponentType<T>,
) => {
  const ModalPicker = withModal(PickerView);

  const Picker: React.FC<Omit<ComposeModalProps<T>, 'children'>> = ({
    children,
    onWillChange,
    ...props
  }) => {
    const hasVisible = 'visible' in props;
    const pure = !children && !hasVisible;
    const [visible, setVisible] = useReactionState<boolean>(props.visible!);

    if (pure) {
      // @ts-ignore
      return <ModalPicker {...props} pure={pure} />;
    }

    if (hasVisible) {
      return (
        // @ts-ignore
        <ModalPicker {...props} onWillChange={onWillChange} pure={false} />
      );
    }

    const handleWillChange = (v: boolean) => {
      onWillChange?.(v);
      setVisible(v);
    };

    const child = React.Children.only(children) as React.ReactElement;
    const touchable = React.cloneElement(child, {
      onPress(e: any) {
        // @ts-ignore
        child.props.onPress?.(e);
        setVisible(!visible);
      },
    });

    return (
      <>
        {touchable}
        {
          // @ts-ignore
          <ModalPicker
            {...props}
            pure={false}
            visible={visible}
            onWillChange={handleWillChange}
          />
        }
      </>
    );
  };

  const show = (props: Omit<ComposeModalProps<T>, 'children'>) =>
    // @ts-ignore
    ModalPicker.show(props);
  const update = (props: Omit<ComposeModalProps<T>, 'children'>) =>
    // @ts-ignore
    ModalPicker.update(props);

  const hide = (key: string) => ModalPicker.hide(key);

  return Object.assign(Picker, { show, update, hide });
};
