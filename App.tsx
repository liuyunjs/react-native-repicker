import React from 'react';
import { View, Text, I18nManager } from 'react-native';
import { DarklyText } from 'rn-darkly';
import { PickerView, Picker } from './library/main';

// I18nManager.forceRTL(false);

const App = () => {
  const [selected, setSelected] = React.useState(0);
  const [visible, setVisible] = React.useState(false);

  const [count, setCount] = React.useState(100);

  const data = React.useMemo(() => {
    return new Array(count)
      .fill(0)
      .map((v, i) => ({ value: i, label: i + 'label' }));
  }, [count]);

  // console.log('selected', visible);
  return (
    <>
      <View style={{ paddingTop: 200 }}>
        <DarklyText
          onPress={() => {
            // setVisible(!visible)
            const key = Picker.show({
              maskCloseable: false,
              data,
              title: '请选择',
              selected,
              onSelected: setSelected,
              onCancel(e) {
                e.preventDefault();
                // Picker.hide(key);
              },
              itemHeight: 32,
              // itemTotal: 9,
            });
          }}
          style={{ color: '#333' }}
          dark_style={{ color: '#ccc' }}>
          open
        </DarklyText>
        {/*<Picker*/}
        {/*  // visible={visible}*/}
        {/*  // onWillChange={setVisible}*/}
        {/*  // forceDark*/}
        {/*  title="请选择"*/}
        {/*  selected={selected}*/}
        {/*  onSelected={setSelected}*/}
        {/*  data={data}></Picker>*/}
      </View>
      <Text
        onPress={() => {
          const count = Math.floor(Math.random() * 100);
          setCount(count);
          // setSelected(count);
        }}
        style={{ fontSize: 30 }}>
        change
      </Text>
    </>
  );
};

export default App;
