import { Link, router, usePage } from '@inertiajs/react';
import { Search } from 'lucide-react';
import { type FormEvent, useState } from 'react';
import AppLogo from '@/components/app-logo';

export default function HomeNavbar() {
    const page = usePage();
    const { auth } = page.props;
    const { url } = page;
    const isCourses = url.startsWith('/courses');
    const isEbooks = url.startsWith('/ebooks');
    const [search, setSearch] = useState(() => {
        const query = url.includes('?') ? url.split('?')[1] : '';

        return new URLSearchParams(query).get('search') ?? '';
    });

    const submitSearch = (event: FormEvent<HTMLFormElement>): void => {
        event.preventDefault();

        const value = search.trim();

        router.get('/courses', value ? { search: value } : {});
    };

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
                        className="shrink-0 text-[14px] font-bold text-[#071457]"
                    >
                        Dasbor
                    </Link>
                ) : (
                    <>
                        <Link
                            href="/login"
                            className="shrink-0 text-[14px] font-bold text-[#071457]"
                        >
                            Masuk
                        </Link>
                        <Link
                            href="/register"
                            className="shrink-0 rounded-lg bg-[#105BDD] px-7 py-3 text-[14px] font-bold text-white shadow-[0_4px_8px_rgba(16,91,221,0.24)] transition hover:bg-[#0B4FC2]"
                        >
                            Daftar
                        </Link>
                    </>
                )}
            </div>
        </header>
    );
}
