import { Head } from '@inertiajs/react';
import {
    Activity,
    BookOpen,
    GraduationCap,
    Library,
    Users,
} from 'lucide-react';
import {
    Area,
    AreaChart,
    Bar,
    BarChart,
    CartesianGrid,
    XAxis,
    YAxis,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    ChartContainer,
    ChartLegend,
    ChartTooltip,
} from '@/components/ui/chart';
import { dashboard } from '@/routes';

type DashboardProps = {
    stats: {
        students: number;
        courses: number;
        publishedCourses: number;
        teachers: number;
        ebooks: number;
        enrollments: number;
    };
    charts: {
        enrollments: { label: string; value: number }[];
        courseStatuses: { status: string; label: string; value: number }[];
        topCourses: { title: string; value: number }[];
    };
};

const enrollmentConfig = {
    value: { label: 'Enrollments', color: 'var(--chart-1)' },
};
const statusConfig = {
    value: { label: 'Courses', color: 'var(--chart-2)' },
};
const topCourseConfig = {
    value: { label: 'Enrollments', color: 'var(--chart-3)' },
};

const cards = [
    { key: 'students', label: 'Students', icon: Users },
    { key: 'courses', label: 'Courses', icon: GraduationCap },
    { key: 'publishedCourses', label: 'Published courses', icon: Activity },
    { key: 'teachers', label: 'Teachers', icon: Users },
    { key: 'ebooks', label: 'Ebooks', icon: BookOpen },
    { key: 'enrollments', label: 'Enrollments', icon: Library },
] as const;

export default function Dashboard({ stats, charts }: DashboardProps) {
    return (
        <>
            <Head title="Dashboard" />
            <div className="space-y-6 p-4 md:p-6">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Dashboard
                    </h1>
                    <p className="text-muted-foreground text-sm">
                        A current view of your learning platform.
                    </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {cards.map(({ key, label, icon: Icon }) => (
                        <Card key={key}>
                            <CardContent className="flex items-center justify-between p-5">
                                <div>
                                    <p className="text-muted-foreground text-sm">
                                        {label}
                                    </p>
                                    <p className="mt-1 text-3xl font-semibold">
                                        {stats[key].toLocaleString()}
                                    </p>
                                </div>
                                <span className="bg-secondary text-secondary-foreground flex size-11 items-center justify-center rounded-lg">
                                    <Icon className="size-5" />
                                </span>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="grid gap-4 xl:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Enrollment trend</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ChartContainer
                                config={enrollmentConfig}
                                className="h-72 w-full"
                            >
                                <AreaChart
                                    data={charts.enrollments}
                                    margin={{ left: 8, right: 8 }}
                                >
                                    <CartesianGrid vertical={false} />
                                    <XAxis
                                        dataKey="label"
                                        tickLine={false}
                                        axisLine={false}
                                        tickMargin={8}
                                    />
                                    <ChartTooltip />
                                    <Area
                                        dataKey="value"
                                        type="monotone"
                                        fill="var(--color-value)"
                                        fillOpacity={0.2}
                                        stroke="var(--color-value)"
                                        strokeWidth={2}
                                    />
                                </AreaChart>
                            </ChartContainer>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Course status</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ChartContainer
                                config={statusConfig}
                                className="h-72 w-full"
                            >
                                <BarChart
                                    data={charts.courseStatuses}
                                    margin={{ left: 8, right: 8 }}
                                >
                                    <CartesianGrid vertical={false} />
                                    <XAxis
                                        dataKey="label"
                                        tickLine={false}
                                        axisLine={false}
                                        tickMargin={8}
                                    />
                                    <ChartTooltip />
                                    <ChartLegend />
                                    <Bar
                                        dataKey="value"
                                        fill="var(--color-value)"
                                        radius={4}
                                    />
                                </BarChart>
                            </ChartContainer>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Top courses by enrollment</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {charts.topCourses.length > 0 ? (
                            <ChartContainer
                                config={topCourseConfig}
                                className="h-80 w-full"
                            >
                                <BarChart
                                    data={charts.topCourses}
                                    layout="vertical"
                                    margin={{ left: 12, right: 12 }}
                                >
                                    <CartesianGrid horizontal={false} />
                                    <XAxis
                                        type="number"
                                        allowDecimals={false}
                                    />
                                    <YAxis
                                        dataKey="title"
                                        type="category"
                                        width={130}
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <ChartTooltip />
                                    <Bar
                                        dataKey="value"
                                        fill="var(--color-value)"
                                        radius={4}
                                    />
                                </BarChart>
                            </ChartContainer>
                        ) : (
                            <div className="text-muted-foreground flex h-80 items-center justify-center text-sm">
                                No course data yet.
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
    ],
};
