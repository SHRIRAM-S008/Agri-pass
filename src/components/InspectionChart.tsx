import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { cn } from '@/lib/utils';

interface InspectionChartProps {
  moisture: number;
  pesticideLevel: string;
  heavyMetalTest: string;
  className?: string;
}

export function InspectionChart({
  moisture,
  pesticideLevel,
  heavyMetalTest,
  className,
}: InspectionChartProps) {
  // Convert text results to scores
  const getPesticideScore = (level: string): number => {
    if (level.toLowerCase().includes('below') || level.toLowerCase().includes('none')) return 100;
    if (level.toLowerCase().includes('low') || level.toLowerCase().includes('minimal')) return 85;
    if (level.toLowerCase().includes('moderate')) return 60;
    if (level.toLowerCase().includes('testing') || level.toLowerCase().includes('pending')) return 50;
    return 40;
  };

  const getHeavyMetalScore = (test: string): number => {
    if (test.toLowerCase() === 'pass') return 100;
    if (test.toLowerCase().includes('pending')) return 50;
    return 30;
  };

  const getMoistureScore = (moisture: number): number => {
    // Optimal moisture is around 12-14% for grains
    if (moisture >= 10 && moisture <= 14) return 100;
    if (moisture >= 8 && moisture <= 16) return 80;
    return 60;
  };

  const data = [
    {
      name: 'Moisture',
      score: getMoistureScore(moisture),
      value: `${moisture}%`,
    },
    {
      name: 'Pesticide',
      score: getPesticideScore(pesticideLevel),
      value: pesticideLevel,
    },
    {
      name: 'Heavy Metals',
      score: getHeavyMetalScore(heavyMetalTest),
      value: heavyMetalTest,
    },
  ];

  const getBarColor = (score: number) => {
    if (score >= 90) return 'hsl(var(--primary))';
    if (score >= 70) return 'hsl(var(--success))';
    if (score >= 50) return 'hsl(var(--warning))';
    return 'hsl(var(--destructive))';
  };

  return (
    <div className={cn('w-full', className)}>
      <h4 className="text-sm font-medium mb-3">Quality Metrics</h4>
      <ResponsiveContainer width="100%" height={180}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 0, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={false} />
          <XAxis type="number" domain={[0, 100]} hide />
          <YAxis
            type="category"
            dataKey="name"
            tick={{ fontSize: 12 }}
            width={80}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const item = payload[0].payload;
                return (
                  <div className="bg-popover border border-border rounded-lg p-2 shadow-lg">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-muted-foreground">Score: {item.score}/100</p>
                    <p className="text-sm text-muted-foreground">Value: {item.value}</p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Bar dataKey="score" radius={[0, 4, 4, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getBarColor(entry.score)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
