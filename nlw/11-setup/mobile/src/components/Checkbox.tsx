import {
  TouchableOpacity,
  TouchableOpacityProps,
  View,
  Text,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import colors from "tailwindcss/colors";
import clsx from "clsx";
import Animated, { ZoomIn } from "react-native-reanimated";

type CheckboxProps = {
  title: string;
  checked?: boolean;
} & TouchableOpacityProps;

export function Checkbox({ title, checked = false, ...rest }: CheckboxProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      className="flex-row mb-2 items-center"
      {...rest}
    >
      {checked ? (
        <Animated.View
          className="h-8 w-8 bg-green-500 rounded-lg items-center justify-center"
          entering={ZoomIn}
        >
          <Feather name="check" size={20} color={colors.white} />
        </Animated.View>
      ) : (
        <View className="h-8 w-8 bg-zinc-900 border-2 border-zinc-800 rounded-lg" />
      )}

      <Text
        className={clsx("text-white text-base ml-3", {
          "text-zinc-400 line-through": checked,
        })}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}
