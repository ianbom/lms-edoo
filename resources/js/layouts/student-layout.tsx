import { Link, router, usePage } from '@inertiajs/react';
import {
    BookOpen,
    CircleUserRound,
    GraduationCap,
    History,
    Home,
    LoaderCircle,
    LogOut,
    Menu,
    Play,
} from 'lucide-react';
import { useState } from 'react';
import AppLogo from '@/components/app-logo';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { logout } from '@/routes';
import type { Auth } from '@/types/auth';

type StudentStats = {
    enrolled: number;
    active: number;
    completed: number;
    progress: number;
};

const navItems = [
    { label: 'Dashboard', href: '/dashboard', icon: Home },
    { label: 'Kelas Saya', href: '/student/classes', icon: BookOpen },
    { label: 'E-Books', href: '/student/ebooks', icon: GraduationCap },
    { label: 'Profil', href: '/student/profile', icon: CircleUserRound },
];

export default function StudentLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const page = usePage<{ auth: Auth; stats?: StudentStats }>();
    const { auth, stats } = page.props;
    const [mobileOpen, setMobileOpen] = useState(false);
    const [logoutOpen, setLogoutOpen] = useState(false);
    const [logoutProcessing, setLogoutProcessing] = useState(false);
    const initials = auth.user.name
        .split(' ')
        .map((part) => part[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();
    const weeklyPercent = stats?.enrolled
        ? Math.min(100, Math.round((stats.completed / stats.enrolled) * 100))
        : 0;
    const confirmLogout = (): void => {
        router.flushAll();
        router.post(
            logout.url(),
            {},
            {
                onStart: () => setLogoutProcessing(true),
                onFinish: () => setLogoutProcessing(false),
                onSuccess: () => setLogoutOpen(false),
            },
        );
    };
    const sidebar = (
        <div className="flex h-full min-h-0 flex-col overflow-x-hidden overflow-y-auto px-5 py-5">
            <Link
                href="/dashboard"
                className="mb-1 flex min-h-14 items-center rounded-xl bg-white px-3 shadow-[0_6px_18px_rgba(4,39,105,.2)]"
                aria-label="Kembali ke dashboard"
            >
                <AppLogo />
            </Link>

            <nav className="mt-4 space-y-1.5">
                {navItems.map((item) => {
                    const active =
                        item.href === '/student/classes'
                            ? page.url.startsWith('/student/classes')
                            : page.url === item.href;
                    return (
                        <Link
                            key={item.label}
                            href={item.href}
                            onClick={() => setMobileOpen(false)}
                            className={`flex h-12 items-center gap-4 rounded-xl px-3.5 text-[13px] font-medium transition ${active ? 'bg-white font-bold text-[#075bd5] shadow-[0_4px_12px_rgba(4,39,105,.16)]' : 'text-white/80 hover:bg-white/15 hover:text-white'}`}
                        >
                            <item.icon
                                size={20}
                                strokeWidth={active ? 2.7 : 2}
                            />
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            <div className="mt-auto border-t border-white/20 pt-4">
                <button
                    type="button"
                    className="flex h-11 w-full items-center gap-4 rounded-xl px-3 text-[13px] font-medium text-white/80 transition hover:bg-white/15 hover:text-white"
                    onClick={() => {
                        setMobileOpen(false);
                        setLogoutOpen(true);
                    }}
                >
                    <LogOut size={19} />
                    Keluar
                </button>
            </div>
        </div>
    );
    return (
        <div className="min-h-screen bg-[#f8fbff] font-sans text-[#111d60]">
            <aside className="fixed inset-y-0 left-0 z-40 hidden w-[246px] rounded-r-[18px] border-r border-[#0b61d4] bg-[#0754c9] shadow-[8px_0_30px_rgba(4,39,105,.16)] lg:block">
                {sidebar}
            </aside>
            {mobileOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <button
                        aria-label="Close navigation"
                        className="absolute inset-0 bg-[#0b164b]/35"
                        onClick={() => setMobileOpen(false)}
                    />
                    <aside className="absolute inset-y-0 left-0 w-[286px] bg-[#0754c9] shadow-2xl">
                        {sidebar}
                    </aside>
                </div>
            )}
            <button
                type="button"
                aria-label="Open navigation"
                className="fixed top-4 left-4 z-40 grid size-11 place-items-center rounded-xl border border-[#dce8f7] bg-white text-[#175fcf] shadow-[0_6px_20px_rgba(32,78,133,.14)] lg:hidden"
                onClick={() => setMobileOpen(true)}
            >
                <Menu size={20} />
            </button>
            <Dialog
                open={logoutOpen}
                onOpenChange={(open) => {
                    if (!logoutProcessing) {
                        setLogoutOpen(open);
                    }
                }}
            >
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Keluar dari akun?</DialogTitle>
                        <DialogDescription>
                            Kamu perlu masuk kembali untuk melanjutkan proses
                            belajar.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            disabled={logoutProcessing}
                            onClick={() => setLogoutOpen(false)}
                        >
                            Batal
                        </Button>
                        <Button
                            type="button"
                            variant="destructive"
                            disabled={logoutProcessing}
                            onClick={confirmLogout}
                        >
                            {logoutProcessing && (
                                <LoaderCircle className="animate-spin" />
                            )}
                            Ya, Keluar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <main className="min-w-0 pt-6 sm:pt-8 lg:ml-[246px]">
                {children}
            </main>
        </div>
    );
}
