import * as Popover from "@radix-ui/react-popover";
import clsx from "clsx";
import { ProgressBar } from "./ProgressBar";
import dayjs from "dayjs";
import { HabitsList } from "./HabitsList";
import { useState } from "react";

type HabitDayProps = {
  date: Date;
  defaultCompleted?: number;
  amount?: number;
};

export function HabitDay({
  defaultCompleted = 0,
  amount = 0,
  date,
}: HabitDayProps) {
  const [completed, setCompleted] = useState<number>(defaultCompleted);
  const percent = amount > 0 ? Math.round((completed / amount) * 100) : 0;

  const dayAndMonth = dayjs(date).format("DD/MM");
  const dayOfWeek = dayjs(date).format("dddd");
  const isDateInPast = dayjs(date).endOf("day").isBefore(new Date());

  function handleCompletedChanged(completed: number) {
    setCompleted(completed);
  }

  return (
    <Popover.Root>
      <Popover.Trigger
        className={clsx(
          "w-10 h-10  border-2  rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-violet-700 focus:ring-offset-2 focus:ring-offset-background",
          {
            "bg-zinc-900 border-zinc-800": percent === 0,
            "bg-violet-900 border-violet-700": percent > 0 && percent < 20,
            "bg-violet-800 border-violet-600": percent >= 20 && percent < 40,
            "bg-violet-700 border-violet-500": percent >= 40 && percent < 60,
            "bg-violet-600 border-violet-500": percent >= 60 && percent < 80,
            "bg-violet-500 border-violet-400": percent >= 80,
            "border-white": !isDateInPast,
          }
        )}
      />
      <Popover.Portal>
        <Popover.Content className="min-w-[320px] p-6 rounded-2xl bg-zinc-900 flex flex-col focus:outline-none focus:ring-2 focus:ring-violet-700 focus:ring-offset-2 focus:ring-offset-background">
          <Popover.Arrow height={8} width={16} className="fill-zinc-900" />

          <span className="font-semibold text-zinc-400">{dayOfWeek}</span>
          <span className="mt-1 font-extrabold leading-tight text-3xl">
            {dayAndMonth}
          </span>
          <ProgressBar progress={percent} />

          <HabitsList date={date} onCompletedChanged={handleCompletedChanged} />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
