type GenerateProgressPercentageProps = {
  total?: number;
  completed?: number;
};

function generateProgressPercentage({
  total = 0,
  completed = 0,
}: GenerateProgressPercentageProps) {
  return total > 0 ? Math.round((completed / total) * 100) : 0;
}

export { generateProgressPercentage };
