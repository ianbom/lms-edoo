import { Link, router, usePage } from '@inertiajs/react';
import { Menu, Search } from 'lucide-react';
import { type FormEvent, useState } from 'react';
import AppLogo from '@/components/app-logo';
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';

export default function HomeNavbar() {
    const page = usePage();
    const { auth } = page.props;
    const { url } = page;
    const isCourses = url.startsWith('/courses');
    const isEbooks = url.startsWith('/ebooks');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [search, setSearch] = useState(() => {
        const query = url.includes('?') ? url.split('?')[1] : '';

        return new URLSearchParams(query).get('search') ?? '';
    });

    const submitSearch = (event: FormEvent<HTMLFormElement>): void => {
        event.preventDefault();

        const value = search.trim();

        setMobileMenuOpen(false);
        router.get('/courses', value ? { search: value } : {});
    };

    const navLinkClass = (active: boolean): string =>
        `block border-b-2 py-3 text-[15px] font-semibold ${active ? 'border-[#105BDD] text-[#071457]' : 'border-transparent text-[#50618C]'}`;

    return (
        <header className="border-b border-[#E8EEF8] bg-white px-5 sm:px-8 lg:px-12">
            <div className="mx-auto flex min-h-16 max-w-[1356px] items-center gap-6">
                <Link
                    href="/"
                    className="mr-auto flex items-center"
                    aria-label="Beranda BRI Peduli"
                >
                    <AppLogo />
                </Link>
                <nav
                    className="hidden items-center gap-7 lg:flex"
                    aria-label="Navigasi utama"
                >
                    <Link
                        href="/"
                        className={`border-b-2 py-[22px] text-[14px] font-semibold ${url === '/' ? 'border-[#105BDD] text-[#071457]' : 'border-transparent text-[#50618C] hover:text-[#105BDD]'}`}
                    >
                        Beranda
                    </Link>
                    <Link
                        href="/courses"
                        className={`border-b-2 py-[22px] text-[14px] font-semibold ${isCourses ? 'border-[#105BDD] text-[#071457]' : 'border-transparent text-[#50618C] hover:text-[#105BDD]'}`}
                    >
                        Kelas
                    </Link>
                    <Link
                        href="/ebooks"
                        className={`border-b-2 py-[22px] text-[14px] font-semibold ${isEbooks ? 'border-[#105BDD] text-[#071457]' : 'border-transparent text-[#50618C] hover:text-[#105BDD]'}`}
                    >
                        E-Books
                    </Link>
                </nav>
                <form
                    className="hidden h-10 w-[286px] items-center gap-2 rounded-full border border-[#DCE6F5] bg-[#F8FBFF] px-4 text-[#6C7CA4] xl:flex"
                    onSubmit={submitSearch}
                >
                    <Search size={20} />
                    <input
                        type="search"
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder="Cari kelas, topik, atau keterampilan..."
                        aria-label="Cari kelas"
                        className="min-w-0 flex-1 bg-transparent text-[13px] outline-none placeholder:text-[#7E8CAF]"
                    />
                </form>
                {auth.user ? (
                    <Link
                        href="/dashboard"
                        className="hidden shrink-0 rounded-lg bg-[#105BDD] px-5 py-2.5 text-center text-[14px] font-bold text-white shadow-[0_4px_8px_rgba(16,91,221,0.18)] transition hover:bg-[#0B4FC2] lg:block"
                    >
                        Dasbor
                    </Link>
                ) : (
                    <>
                        <Link
                            href="/login"
                            className="hidden shrink-0 rounded-lg border border-[#BFD7FF] bg-[#F1F7FF] px-5 py-2.5 text-center text-[14px] font-bold text-[#1054D0] transition hover:bg-[#E5F0FF] lg:block"
                        >
                            Masuk
                        </Link>
                        <Link
                            href="/register"
                            className="hidden shrink-0 rounded-lg bg-[#105BDD] px-7 py-3 text-[14px] font-bold text-white shadow-[0_4px_8px_rgba(16,91,221,0.24)] transition hover:bg-[#0B4FC2] lg:block"
                        >
                            Daftar
                        </Link>
                    </>
                )}
                <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                    <SheetTrigger asChild>
                        <button
                            type="button"
                            className="text-[#071457] lg:hidden"
                            aria-label="Buka menu navigasi"
                        >
                            <Menu size={24} />
                        </button>
                    </SheetTrigger>
                    <SheetContent
                        side="right"
                        className="w-[min(86vw,360px)] border-l border-[#E8EEF8] bg-white p-0 text-[#070B49] sm:max-w-sm"
                    >
                        <SheetHeader className="border-b border-[#E8EEF8] px-5 py-5 pr-14 text-left">
                            <AppLogo />
                            <SheetTitle className="sr-only">
                                Menu navigasi
                            </SheetTitle>
                            <SheetDescription className="sr-only">
                                Navigasi utama website
                            </SheetDescription>
                        </SheetHeader>
                        <div className="flex flex-1 flex-col overflow-y-auto px-5 py-6">
                            <form
                                className="flex h-11 items-center gap-2 rounded-full border border-[#DCE6F5] bg-[#F8FBFF] px-4 text-[#6C7CA4]"
                                onSubmit={submitSearch}
                            >
                                <Search size={18} />
                                <input
                                    type="search"
                                    value={search}
                                    onChange={(event) =>
                                        setSearch(event.target.value)
                                    }
                                    placeholder="Cari kelas..."
                                    aria-label="Cari kelas"
                                    className="min-w-0 flex-1 bg-transparent text-[13px] outline-none placeholder:text-[#7E8CAF]"
                                />
                            </form>

                            <nav
                                className="mt-8 space-y-1"
                                aria-label="Navigasi utama mobile"
                            >
                                <SheetClose asChild>
                                    <Link
                                        href="/"
                                        className={navLinkClass(url === '/')}
                                    >
                                        Beranda
                                    </Link>
                                </SheetClose>
                                <SheetClose asChild>
                                    <Link
                                        href="/courses"
                                        className={navLinkClass(isCourses)}
                                    >
                                        Kelas
                                    </Link>
                                </SheetClose>
                                <SheetClose asChild>
                                    <Link
                                        href="/ebooks"
                                        className={navLinkClass(isEbooks)}
                                    >
                                        E-Books
                                    </Link>
                                </SheetClose>
                            </nav>

                            <div className="mt-8 border-t border-[#E8EEF8] pt-6">
                                {auth.user ? (
                                    <SheetClose asChild>
                                        <Link
                                            href="/dashboard"
                                            className="block rounded-lg bg-[#105BDD] px-4 py-3 text-center text-[14px] font-bold text-white transition hover:bg-[#0B4FC2]"
                                        >
                                            Dasbor
                                        </Link>
                                    </SheetClose>
                                ) : (
                                    <div className="grid gap-3">
                                        <SheetClose asChild>
                                            <Link
                                                href="/login"
                                                className="block rounded-lg border border-[#BFD7FF] bg-[#F1F7FF] px-4 py-3 text-center text-[14px] font-bold text-[#1054D0] transition hover:bg-[#E5F0FF]"
                                            >
                                                Masuk
                                            </Link>
                                        </SheetClose>
                                        <SheetClose asChild>
                                            <Link
                                                href="/register"
                                                className="block rounded-lg bg-[#105BDD] px-4 py-3 text-center text-[14px] font-bold text-white shadow-[0_4px_8px_rgba(16,91,221,0.24)] transition hover:bg-[#0B4FC2]"
                                            >
                                                Daftar
                                            </Link>
                                        </SheetClose>
                                    </div>
                                )}
                            </div>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </header>
    );
}
