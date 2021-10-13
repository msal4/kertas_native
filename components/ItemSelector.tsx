import React, { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { View, Dimensions, TouchableWithoutFeedback } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ScrollBottomSheet from "react-native-scroll-bottom-sheet";
import { KText } from "./KText";
import { Touchable } from "./Touchable";

interface Item<T> {
  title: string;
  subtitle?: string;
  value: T;
}

interface ItemSelectorProps<T> {
  ref?: any;
  data: Item<T>[];
  currentValue?: T;
  onChange?: (item: Item<T>) => void;
  maxHeight?: string | number;
  itemBackground?: (value: T) => string;
  titleColor?: (value: T) => string;
}

const windowHeight = Dimensions.get("window").height;

type _ItemSelector = typeof _ItemSelector;

export interface ItemSelector {
  close: () => void;
  open: () => void;
}

const _ItemSelector = function <T = string | number>(
  { data, currentValue, onChange, maxHeight, titleColor, itemBackground }: ItemSelectorProps<T>,
  ref: any
) {
  const { bottom } = useSafeAreaInsets();
  const bottomSheet = useRef<ScrollBottomSheet<Item<T>>>();
  const flatList = useRef<FlatList<Item<T>>>();
  const [isBGShown, setIsBGShown] = useState(false);

  useImperativeHandle(ref, () => ({ close, open }));

  const close = () => {
    setIsBGShown(false);
    bottomSheet.current?.snapTo(1);
  };

  const open = () => {
    setIsBGShown(true);
    bottomSheet.current?.snapTo(0);
    const currentItem = data.find((i) => i.value === currentValue);
    if (currentItem) flatList.current?.scrollToItem({ item: currentItem, animated: true });
  };

  return (
    <>
      {isBGShown ? (
        <TouchableWithoutFeedback onPress={close}>
          <View
            style={{
              backgroundColor: "black",
              position: "absolute",
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
              opacity: 0.3,
            }}
          />
        </TouchableWithoutFeedback>
      ) : null}
      <ScrollBottomSheet
        ref={bottomSheet as any}
        componentType="FlatList"
        snapPoints={[maxHeight ?? "50%", windowHeight]}
        initialSnapIndex={1}
        renderHandle={() => (
          <View
            style={{
              alignItems: "center",
              backgroundColor: "#f4f4f4",
              paddingVertical: 20,
            }}
          >
            <View
              style={{
                width: 40,
                height: 4,
                backgroundColor: "rgba(0,0,0,0.2)",
                borderRadius: 4,
              }}
            />
          </View>
        )}
        onSettle={(snap) => {
          setIsBGShown(snap === 0);
        }}
        containerStyle={{
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          paddingBottom: bottom,
          backgroundColor: "#f4f4f4",
          overflow: "hidden",
        }}
        data={data}
        keyExtractor={(c) => c.value + ""}
        ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
        innerRef={flatList as any}
        renderItem={({ item }: { item: Item<T> }) => {
          const isSelected = item.value === currentValue;

          return (
            <Touchable
              style={{
                flexDirection: "row",
                padding: 20,
                backgroundColor: isSelected
                  ? itemBackground
                    ? itemBackground(item.value)
                    : "#a18cd1"
                  : "white",
                alignItems: "center",
                borderRadius: 20,
              }}
              onPress={() => {
                onChange && onChange(item);
                close();
              }}
            >
              <KText
                numberOfLines={1}
                style={{
                  color: !isSelected ? (titleColor ? titleColor(item.value) : undefined) : "#fff",
                  flex: 1,
                  marginRight: 5,
                }}
              >
                {item.title}
              </KText>
              {item.subtitle ? (
                <KText style={{ color: isSelected ? "#f4f4f4" : "#9a9a9a" }}>{item.subtitle}</KText>
              ) : null}
            </Touchable>
          );
        }}
        contentContainerStyle={{ padding: 15, backgroundColor: "#f4f4f4" }}
      />
    </>
  );
};

export const ItemSelector: _ItemSelector = forwardRef(_ItemSelector) as any;
