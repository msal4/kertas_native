import Toast from "react-native-root-toast";

export function showErrToast(msg: string) {
  Toast.show(msg, {
    shadow: false,
    delay: 0,
    backgroundColor: "#E05D5D",
    duration: Toast.durations.LONG,
    position: Toast.positions.BOTTOM,
    containerStyle: { borderRadius: 100, paddingHorizontal: 30 },
  });
}

export function showSuccessToast(msg: string) {
  Toast.show(msg, {
    shadow: false,
    delay: 0,
    backgroundColor: "#38A3A5",
    duration: Toast.durations.SHORT,
    position: Toast.positions.BOTTOM,
    textColor: "white",
    containerStyle: { borderRadius: 100, paddingHorizontal: 30 },
  });
}
