import { Link, usePage } from '@inertiajs/react';
import { ArrowUpRight, BookOpen, CheckCircle2 } from 'lucide-react';
import AppLogoIcon from '@/components/app-logo-icon';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';

export default function AuthSimpleLayout({ children, title, description }: AuthLayoutProps) {
    const { name } = usePage().props;

    return (
        <main className="min-h-[100dvh] bg-[#FBFCFF] lg:grid lg:grid-cols-[minmax(0,1.05fr)_minmax(460px,0.95fr)]">
            <section className="relative hidden overflow-hidden bg-[#1054D0] p-10 text-white lg:flex lg:flex-col lg:justify-between xl:p-16" aria-hidden="true">
                <div className="absolute -right-24 -top-24 size-96 rounded-full border border-white/15" />
                <div className="absolute -bottom-40 -left-24 size-[34rem] rounded-full border border-white/10" />
                <div className="relative flex items-center gap-3">
                    <AppLogoIcon className="size-9 fill-current text-white" />
                    <span className="text-lg font-semibold tracking-tight">{name}</span>
                </div>
                <div className="relative max-w-xl space-y-8">
                    <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-sm text-white/85">
                        <BookOpen className="size-4" />
                        Belajar tanpa batas
                    </div>
                    <h1 className="max-w-lg text-4xl font-semibold leading-[1.08] tracking-tight xl:text-6xl">
                        Bangun keterampilan yang membawa Anda lebih jauh.
                    </h1>
                    <p className="max-w-md text-base leading-7 text-white/75">
                        Akses kelas terarah, materi praktis, dan pembelajaran yang bisa Anda lanjutkan kapan saja.
                    </p>
                    <div className="grid gap-3 text-sm text-white/85">
                        <div className="flex items-center gap-3"><CheckCircle2 className="size-5 text-[#DCECFC]" />Materi terstruktur dari dasar hingga mahir</div>
                        <div className="flex items-center gap-3"><CheckCircle2 className="size-5 text-[#DCECFC]" />Progress belajar tersimpan otomatis</div>
                    </div>
                </div>
                <p className="relative text-sm text-white/55">Platform pembelajaran untuk langkah berikutnya.</p>
            </section>

            <section className="flex min-h-[100dvh] items-center justify-center px-5 py-10 sm:px-8">
                <div className="w-full max-w-[410px]">
                    <Link href={home()} className="mb-10 flex items-center gap-2 lg:hidden">
                        <AppLogoIcon className="size-8 fill-current text-[#1054D0]" />
                        <span className="font-semibold text-[#070B49]">{name}</span>
                    </Link>
                    <div className="mb-8 space-y-2">
                        <p className="text-sm font-medium text-[#1054D0]">Selamat datang kembali</p>
                        <h2 className="text-3xl font-semibold tracking-tight text-[#070B49]">{title}</h2>
                        <p className="text-sm leading-6 text-[#59648A]">{description}</p>
                    </div>
                    {children}
                    <Link href={home()} className="mt-10 inline-flex items-center gap-1 text-xs text-[#7D89A8] transition-colors hover:text-[#1054D0]">
                        Kembali ke beranda <ArrowUpRight className="size-3.5" />
                    </Link>
                </div>
            </section>
        </main>
    );
}
