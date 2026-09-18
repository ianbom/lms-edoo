import { Link, usePage } from '@inertiajs/react';
import {
    ChevronDown,
    GraduationCap,
    Search,
} from 'lucide-react';

export default function HomeNavbar() {
    const { auth } = usePage().props;
    const { url } = usePage();
    const isCourses = url.startsWith('/courses');

    return (
        <header className="border-b border-[#E8EEF8] bg-white px-5 sm:px-8 lg:px-12">
            <div className="mx-auto flex min-h-16 max-w-[1356px] items-center gap-6">
            <Link
                href="/"
                className="mr-auto flex items-center gap-2.5"
                aria-label="EduLearn home"
            >
                <GraduationCap className="size-11 fill-[#105BDD] text-[#105BDD]" strokeWidth={1.5} />
                <span className="leading-none">
                    <strong className="block text-[25px] font-extrabold tracking-[-1.5px] text-[#105BDD]">EduLearn</strong>
                    <small className="mt-1 block text-[11px] font-medium text-[#60709A]">Belajar Hari Ini, Lebih Baik Esok</small>
                </span>
            </Link>
            <nav
                className="hidden items-center gap-7 lg:flex"
                aria-label="Main navigation"
            >
                <Link href="/" className={`border-b-2 py-[22px] text-[14px] font-semibold ${!isCourses ? 'border-[#105BDD] text-[#071457]' : 'border-transparent text-[#50618C] hover:text-[#105BDD]'}`}>Home</Link>
                <Link href="/courses" className={`flex items-center gap-1 border-b-2 py-[22px] text-[14px] font-semibold ${isCourses ? 'border-[#105BDD] text-[#071457]' : 'border-transparent text-[#50618C] hover:text-[#105BDD]'}`}>Kelas <ChevronDown size={14} /></Link>
                {['Tentang Kami', 'Untuk Institusi', 'Blog', 'Kontak'].map((item) => <a key={item} href="#" className="text-[14px] font-medium text-[#50618C] hover:text-[#105BDD]">{item}</a>)}
            </nav>
            <form action="/courses" className="hidden h-10 w-[286px] items-center gap-2 rounded-full border border-[#DCE6F5] bg-[#F8FBFF] px-4 text-[#6C7CA4] xl:flex">
                <Search size={20} />
                <input name="search" type="search" placeholder="Cari kelas, topik, atau keterampilan..." className="min-w-0 flex-1 bg-transparent text-[13px] outline-none placeholder:text-[#7E8CAF]" />
            </form>
            {auth.user ? (
                <Link href="/dashboard" className="shrink-0 text-[14px] font-bold text-[#071457]">Dashboard</Link>
            ) : (
                <Link href="/login" className="shrink-0 text-[14px] font-bold text-[#071457]">Masuk</Link>
            )}
            <Link href="/register" className="shrink-0 rounded-lg bg-[#105BDD] px-7 py-3 text-[14px] font-bold text-white shadow-[0_4px_8px_rgba(16,91,221,0.24)] transition hover:bg-[#0B4FC2]">Daftar</Link>
            </div>
        </header>
    );
}
