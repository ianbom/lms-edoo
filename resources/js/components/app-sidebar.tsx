import { Link, usePage } from '@inertiajs/react';
import {
    FileText,
    Layers3,
    LayoutGrid,
    Library,
    Tags,
    UserRound,
    Users,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { index as courses } from '@/routes/admin/courses';
import { index as courseCategories } from '@/routes/admin/course-categories';
import { index as ebookCategories } from '@/routes/admin/ebook-categories';
import { index as ebooks } from '@/routes/admin/ebooks';
import { index as students } from '@/routes/admin/students';
import { index as teachers } from '@/routes/admin/teachers';
import type { Auth } from '@/types/auth';

export function AppSidebar() {
    const { auth } = usePage<{ auth: Auth }>().props;
    const groups = [
        {
            title: 'Overview',
            items: [
                { title: 'Dashboard', href: dashboard(), icon: LayoutGrid },
            ],
        },
        ...(auth.user.role === 'admin'
            ? [
                  {
                      title: 'Learning Management',
                      items: [
                          {
                              title: 'Courses',
                              href: courses(),
                              icon: Library,
                          },
                          {
                              title: 'Course Materials',
                              href: '/admin/course-materials',
                              icon: Layers3,
                          },
                          {
                              title: 'Learning Contents',
                              href: '/admin/learning-contents',
                              icon: FileText,
                          },
                          {
                              title: 'Course Categories',
                              href: courseCategories(),
                              icon: Tags,
                          },
                          {
                              title: 'Teachers',
                              href: teachers(),
                              icon: UserRound,
                          },
                      ],
                  },
                  {
                      title: 'Library',
                      items: [
                          {
                              title: 'Ebook Categories',
                              href: ebookCategories(),
                              icon: Tags,
                          },
                          {
                              title: 'Ebooks',
                              href: ebooks(),
                              icon: Library,
                          },
                      ],
                  },
                  {
                      title: 'User Management',
                      items: [
                          {
                              title: 'Students',
                              href: students(),
                              icon: Users,
                          },
                      ],
                  },
              ]
            : []),
    ];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain groups={groups} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
