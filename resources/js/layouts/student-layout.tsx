import { Link, router, usePage } from '@inertiajs/react';
import {
    BookOpen,
    CircleUserRound,
    GraduationCap,
    Home,
    LoaderCircle,
    LogOut,
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

const navItems = [
    { label: 'Dasbor', href: '/dashboard', icon: Home },
    { label: 'Kelas Saya', href: '/student/classes', icon: BookOpen },
    { label: 'E-Book', href: '/student/ebooks', icon: GraduationCap },
    { label: 'Profil', href: '/student/profile', icon: CircleUserRound },
];

export default function StudentLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const page = usePage();
    const [logoutOpen, setLogoutOpen] = useState(false);
    const [logoutProcessing, setLogoutProcessing] = useState(false);
    const isActive = (href: string): boolean =>
        href === '/dashboard' ? page.url === href : page.url.startsWith(href);

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

    return (
        <div className="min-h-screen bg-[#f8fbff] font-sans text-[#111d60]">
            <aside className="fixed inset-y-0 left-0 z-40 hidden w-[246px] rounded-r-[18px] border-r border-[#dce8f7] bg-white shadow-[8px_0_30px_rgba(32,78,133,.08)] lg:block">
                <div className="flex h-full min-h-0 flex-col overflow-x-hidden overflow-y-auto px-5 py-5">
                    <Link
                        href="/dashboard"
                        className="mb-1 flex min-h-14 items-center"
                        aria-label="Kembali ke dashboard"
                    >
                        <AppLogo />
                    </Link>

                    <nav className="mt-4 space-y-1.5">
                        {navItems.slice(0, -1).map((item) => {
                            const active = isActive(item.href);

                            return (
                                <Link
                                    key={item.label}
                                    href={item.href}
                                    className={`flex h-12 items-center gap-4 rounded-xl px-3.5 text-[13px] font-medium transition ${active ? 'bg-[#e8f3ff] font-bold text-[#075bd5] shadow-[0_4px_12px_rgba(32,78,133,.08)]' : 'text-[#7183a2] hover:bg-[#f1f6fc] hover:text-[#075bd5]'}`}
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

                    <div className="mt-auto space-y-1.5 border-t border-[#e5eef9] pt-4">
                        {(() => {
                            const item = navItems[navItems.length - 1];
                            const active = isActive(item.href);

                            return (
                                <Link
                                    href={item.href}
                                    className={`flex h-12 items-center gap-4 rounded-xl px-3.5 text-[13px] font-medium transition ${active ? 'bg-[#e8f3ff] font-bold text-[#075bd5] shadow-[0_4px_12px_rgba(32,78,133,.08)]' : 'text-[#7183a2] hover:bg-[#f1f6fc] hover:text-[#075bd5]'}`}
                                >
                                    <item.icon
                                        size={20}
                                        strokeWidth={active ? 2.7 : 2}
                                    />
                                    {item.label}
                                </Link>
                            );
                        })()}
                        <Button
                            type="button"
                            variant="ghost"
                            className="h-12 w-full justify-start gap-4 rounded-xl px-3.5 text-[13px] font-medium text-[#7183a2] hover:bg-red-50 hover:text-red-600"
                            onClick={() => setLogoutOpen(true)}
                        >
                            <LogOut size={20} />
                            Keluar
                        </Button>
                    </div>
                </div>
            </aside>

            <main className="min-w-0 pt-6 pb-[calc(5.5rem+env(safe-area-inset-bottom))] sm:pt-8 lg:ml-[246px] lg:pb-0">
                {children}
            </main>

            <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-[#dce8f7] bg-white/95 px-2 pt-2 pb-[calc(.5rem+env(safe-area-inset-bottom))] shadow-[0_-8px_24px_rgba(32,78,133,.12)] backdrop-blur lg:hidden">
                <div className="mx-auto grid max-w-md grid-cols-4 gap-1">
                    {navItems.map((item) => {
                        const active = isActive(item.href);

                        return (
                            <Link
                                key={item.label}
                                href={item.href}
                                aria-current={active ? 'page' : undefined}
                                className={`flex min-w-0 flex-col items-center justify-center gap-1 rounded-xl px-1 py-2 text-[10px] font-medium transition ${active ? 'bg-transparent font-bold text-[#075bd5]' : 'text-[#7183a2] hover:bg-[#f1f6fc] hover:text-[#075bd5]'}`}
                            >
                                <item.icon
                                    size={20}
                                    strokeWidth={active ? 2.7 : 2}
                                />
                                <span className="truncate">{item.label}</span>
                            </Link>
                        );
                    })}
                </div>
            </nav>

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
        </div>
    );
}
