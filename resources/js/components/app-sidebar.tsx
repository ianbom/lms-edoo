import { Link, usePage } from '@inertiajs/react';
import type { CSSProperties } from 'react';
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
    const sidebarStyle = {
        '--sidebar': '#1054D0',
        '--sidebar-foreground': '#FFFFFF',
        '--sidebar-primary': '#FFFFFF',
        '--sidebar-primary-foreground': '#1054D0',
        '--sidebar-accent': '#FFFFFF',
        '--sidebar-accent-foreground': '#1054D0',
        '--sidebar-border': '#FFFFFF33',
        '--sidebar-ring': '#FFFFFF',
    } as CSSProperties;
    const groups = [
        {
            title: 'Ringkasan',
            items: [
                { title: 'Dasbor', href: dashboard(), icon: LayoutGrid },
            ],
        },
        ...(auth.user.role === 'admin'
            ? [
                  {
                      title: 'Manajemen Pembelajaran',
                      items: [
                          {
                              title: 'Kelas',
                              href: courses(),
                              icon: Library,
                          },
                          {
                              title: 'Modul Kelas',
                              href: '/admin/course-materials',
                              icon: Layers3,
                          },
                          {
                              title: 'Materi Pembelajaran',
                              href: '/admin/learning-contents',
                              icon: FileText,
                          },
                          {
                              title: 'Kategori Kelas',
                              href: courseCategories(),
                              icon: Tags,
                          },
                          {
                              title: 'Instruktur',
                              href: teachers(),
                              icon: UserRound,
                          },
                      ],
                  },
                  {
                      title: 'Perpustakaan',
                      items: [
                          {
                              title: 'Kategori E-book',
                              href: ebookCategories(),
                              icon: Tags,
                          },
                          {
                              title: 'E-book',
                              href: ebooks(),
                              icon: Library,
                          },
                      ],
                  },
                  {
                      title: 'Manajemen Pengguna',
                      items: [
                          {
                              title: 'Siswa',
                              href: students(),
                              icon: Users,
                          },
                      ],
                  },
              ]
            : []),
    ];

    return (
        <Sidebar
            collapsible="icon"
            variant="inset"
            className="bg-[#1054D0] [&_[data-sidebar=sidebar]]:!bg-[#1054D0]"
            style={sidebarStyle}
        >
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link
                                href={dashboard()}
                                prefetch
                                className="inline-flex rounded-md bg-white px-2 py-1"
                            >
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent
                className="[&_[data-sidebar=group-label]]:!text-white/75 [&_[data-sidebar=menu-button]]:!text-white [&_[data-sidebar=menu-button]:hover]:!bg-white [&_[data-sidebar=menu-button]:hover]:!text-[#1054D0] [&_[data-sidebar=menu-button][data-active=true]]:!bg-white [&_[data-sidebar=menu-button][data-active=true]]:!text-[#1054D0]"
            >
                <NavMain groups={groups} />
            </SidebarContent>

            <SidebarFooter className="m-2 overflow-hidden rounded-lg bg-white p-0 text-[#1054D0]">
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
