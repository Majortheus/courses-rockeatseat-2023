import { useEffect } from "react";
import { View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

type ProgressBarProps = {
  progress?: number;
};

export function ProgressBar({ progress = 0 }: ProgressBarProps) {
  const sharedProgress = useSharedValue(progress);

  useEffect(() => {
    sharedProgress.value = withTiming(progress);
  }, [progress]);

  return (
    <View className="w-full h-3 rounded-xl bg-zinc-700 mt-4 overflow-hidden">
      <Animated.View
        className="h-3 rounded-xl bg-violet-600"
        style={useAnimatedStyle(() => ({ width: `${sharedProgress.value}%` }))}
      />
    </View>
  );
}
