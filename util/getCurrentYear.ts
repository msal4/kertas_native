import dayjs from "dayjs";
import { ValueOf } from "react-native-gesture-handler/lib/typescript/typeUtils";
import Years from "../constants/Years";

type Year = ValueOf<typeof Years>;

export default function getCurrentYear(): Year {
  const now = dayjs();
  const yr = now.year();
  const mth = now.month();

  if (mth >= 8) {
    return `${yr}-${yr + 1}` as Year;
  }

  return `${yr - 1}-${yr}` as Year;
}
