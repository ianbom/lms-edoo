import * as React from 'react';
import {
    Legend,
    ResponsiveContainer,
    Tooltip,
} from 'recharts';
import { cn } from '@/lib/utils';

export type ChartConfig = Record<
    string,
    { label?: React.ReactNode; color?: string }
>;

type ChartContextValue = { config: ChartConfig };
const ChartContext = React.createContext<ChartContextValue | null>(null);

export function ChartContainer({
    config,
    className,
    children,
}: React.ComponentProps<'div'> & { config: ChartConfig }) {
    const id = React.useId();
    const variables = Object.fromEntries(
        Object.entries(config)
            .filter(([, value]) => value.color)
            .map(([key, value]) => ['--color-' + key, value.color]),
    ) as React.CSSProperties;

    return (
        <ChartContext.Provider value={{ config }}>
            <div
                data-chart={id.replaceAll(':', '')}
                className={cn(
                    'flex aspect-video justify-center text-xs [&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line[stroke="#ccc"]]:stroke-border/50 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&_.recharts-layer]:outline-hidden [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted [&_.recharts-surface]:outline-hidden',
                    className,
                )}
                style={variables}
            >
                <ResponsiveContainer>{children}</ResponsiveContainer>
            </div>
        </ChartContext.Provider>
    );
}

export function ChartTooltip(
    props: React.ComponentProps<typeof Tooltip>,
) {
    return <Tooltip {...props} content={<ChartTooltipContent />} />;
}

type ChartTooltipContentProps = {
    active?: boolean;
    payload?: {
        dataKey?: string | number;
        name?: string | number;
        color?: string;
        value?: React.ReactNode;
    }[];
    label?: React.ReactNode;
};

export function ChartTooltipContent({
    active,
    payload,
    label,
}: ChartTooltipContentProps) {
    const context = React.useContext(ChartContext);

    if (!active || !payload?.length) return null;

    return (
        <div className="bg-background grid min-w-32 gap-1.5 rounded-lg border px-3 py-2 text-xs shadow-xl">
            <div className="font-medium">{label}</div>
            {payload.map((item) => {
                const key = String(item.dataKey ?? item.name ?? 'value');
                const color = context?.config[key]?.color ?? item.color;

                return (
                    <div key={key} className="flex items-center gap-2">
                        <span
                            className="size-2 rounded-full"
                            style={{ backgroundColor: color }}
                        />
                        <span className="text-muted-foreground">
                            {context?.config[key]?.label ?? item.name ?? key}
                        </span>
                        <span className="ml-auto font-mono font-medium">
                            {item.value}
                        </span>
                    </div>
                );
            })}
        </div>
    );
}

export { Legend as ChartLegend };
