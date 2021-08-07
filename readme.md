# react-native-repicker

## 安装

### yarn
```shell
yarn add react-native-repicker react-native-reanimated react-native-linear-gradient react-native-gesture-handler
```
### npm
```shell
npm install react-native-repicker react-native-reanimated react-native-linear-gradient react-native-gesture-handler --save
```

## 示例
```javascript
import React from 'react';
import { View, Text, SafeAreaView } from 'react-native';
import { Picker } from './library/main';

const data = new Array(100)
  .fill(0)
  .map((v, i) => ({ value: i, label: i + 'label' }));

const App = () => {
  const [selected, setSelected] = React.useState(0);

  return (
    <SafeAreaView>
      <View style={{ paddingTop: 200 }}>
        <Picker
          selected={selected}
          onChange={(item) => setSelected(item.value)}
          data={data}
        />
      </View>
      <Text
        onPress={() => {
          setSelected(Math.floor(Math.random() * 100));
        }}
        style={{ fontSize: 30 }}>
        change
      </Text>
    </SafeAreaView>
  );
};
```

## Props

#### data: {value: string | number, label: string | number}[];
用于选择器的数据;

#### onChange?: (selected: {value: string | number, label: string | number}) => void;
选中某一条数据时触发;

#### selected?: string | number;
指定选中某一条数据;

#### itemHeight?: number;
选择器中的行高， 默认为 36;

#### itemTotal?: number;
可见区域内，展示几行，默认为 7;

#### itemFontSize?: number;
文字字号，默认为 16;

#### itemColor?: string;
文字颜色，默认为 #333;

#### indicatorColor?: string;
细横线的颜色，默认为 #666;

#### overlayColor?: string;
遮罩的颜色， 默认为 #fff;


> 以下需要 useColorScheme Api 的支持

#### darkItemColor?: string;
暗黑模式下, 文字的颜色, 默认为 #eee;

#### darkIndicatorColor?: string;
暗黑模式下, 细横线的颜色，默认为 #ccc;

#### darkOverlayColor?: string;
暗黑模式下, 遮罩的颜色， 默认为 #000;
