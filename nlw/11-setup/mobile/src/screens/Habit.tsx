import { useRoute } from "@react-navigation/native";
import { Alert, ScrollView, Text, View } from "react-native";
import dayjs from "dayjs";
import { BackButton } from "../components/BackButton";
import { ProgressBar } from "../components/ProgressBar";
import { Checkbox } from "../components/Checkbox";
import { useEffect, useState } from "react";
import { Loading } from "../components/Loading";
import { api } from "../lib/axios";
import { generateProgressPercentage } from "../utils/generate-progress-percentage";
import { HabitsEmpty } from "../components/HabitsEmpty";
import clsx from "clsx";

type DayInfoAPI = {
  possibleHabits: {
    id: string;
    title: string;
    created_at: string;
  }[];
  completedHabits: string[];
};

type HabitParams = {
  date: string;
};

export function Habit() {
  const [loading, setLoading] = useState<boolean>(true);
  const [dayInfo, setDayInfo] = useState<DayInfoAPI>();
  const [completedHabits, setCompletedHabits] = useState<string[]>([]);
  const route = useRoute();
  const { date } = route.params as HabitParams;

  const parsedDate = dayjs(date);
  const isDateInPast = parsedDate.endOf("day").isBefore(new Date());
  const dayOfWeek = parsedDate.format("dddd");
  const dayAndMonth = parsedDate.format("DD/MM");

  const habitsProgress = generateProgressPercentage({
    total: dayInfo?.possibleHabits.length,
    completed: completedHabits.length,
  });

  async function fetchHabits() {
    try {
      setLoading(true);

      const { data } = await api.get<DayInfoAPI>("/day", { params: { date } });
      setDayInfo(data);
      setCompletedHabits(data.completedHabits);
    } catch (error) {
      console.log({ error });
      Alert.alert(
        "Ops",
        "Não foi possível carregar as informações dos hábitos"
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleToggleHabit(habitId: string) {
    try {
      if (completedHabits.includes(habitId)) {
        setCompletedHabits((prevState) =>
          prevState.filter((id) => id !== habitId)
        );
      } else {
        setCompletedHabits((prevState) => [...prevState, habitId]);
      }

      await api.patch(`/habits/${habitId}/toggle`);
    } catch (error) {
      console.log({ error });
      Alert.alert("Ops", "Não foi possível atualizar o status do hábito");
    }
  }

  useEffect(() => {
    fetchHabits();
  }, []);

  if (loading) {
    return (
      <View className="flex-1 bg-background px-8 pt-16">
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          <BackButton />

          <Text className="mt-6 text-zinc-400 font-semibold text-base lowercase">
            {dayOfWeek}
          </Text>

          <Text className="text-white font-extrabold text-3xl">
            {dayAndMonth}
          </Text>

          <ProgressBar progress={0} />

          <View className="mt-6">
            <Loading />
          </View>
        </ScrollView>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background px-8 pt-16">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <BackButton />

        <Text className="mt-6 text-zinc-400 font-semibold text-base lowercase">
          {dayOfWeek}
        </Text>

        <Text className="text-white font-extrabold text-3xl">
          {dayAndMonth}
        </Text>

        <ProgressBar progress={habitsProgress} />

        <View
          className={clsx("mt-6", {
            "opacity-60": isDateInPast,
          })}
        >
          {dayInfo?.possibleHabits.length ? (
            dayInfo?.possibleHabits.map((habit) => (
              <Checkbox
                key={habit.id}
                title={habit.title}
                checked={completedHabits.includes(habit.id)}
                disabled={isDateInPast}
                onPress={() => handleToggleHabit(habit.id)}
              />
            ))
          ) : (
            <HabitsEmpty />
          )}

          {isDateInPast && (
            <Text className="text-zinc-400 mt-10 text-center">
              Você não pode editar hábitos de uma data passada.
            </Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
