import { Link } from '@inertiajs/react';
import { ArrowUpRight } from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    return (
        <main className="h-[100dvh] overflow-hidden bg-[#FBFCFF] lg:grid lg:grid-cols-[minmax(0,1.05fr)_minmax(460px,0.95fr)]">
            <section
                className="relative hidden min-h-[100dvh] overflow-hidden lg:block"
                aria-hidden="true"
            >
                <img
                    src="/login.png"
                    alt=""
                    className="absolute inset-0 size-full object-cover"
                />
            </section>

            <section className="flex h-[100dvh] min-h-0 items-center justify-center overflow-y-auto px-5 py-5 sm:px-8 sm:py-6">
                <div className="w-full max-w-[410px]">
                    <Link href={home()} className="mb-6 inline-flex">
                        <AppLogo />
                    </Link>
                    <div className="mb-5 space-y-1.5">
                        <p className="text-sm font-medium text-[#1054D0]">
                            Selamat datang kembali
                        </p>
                        <h2 className="text-3xl font-semibold tracking-tight text-[#070B49]">
                            {title}
                        </h2>
                        <p className="text-sm leading-6 text-[#59648A]">
                            {description}
                        </p>
                    </div>
                    {children}
                    <Link
                        href={home()}
                        className="mt-10 inline-flex items-center gap-1 text-xs text-[#7D89A8] transition-colors hover:text-[#1054D0]"
                    >
                        Kembali ke beranda <ArrowUpRight className="size-3.5" />
                    </Link>
                </div>
            </section>
        </main>
    );
}
