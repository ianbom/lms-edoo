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
        <main className="h-dvh max-h-dvh overflow-hidden bg-white lg:grid lg:grid-cols-[minmax(420px,0.9fr)_minmax(0,1.1fr)]">
            <section className="flex min-h-0 min-w-0 items-center justify-center overflow-y-auto bg-white px-5 py-8 sm:px-10 lg:h-dvh lg:overflow-hidden lg:px-14 lg:py-8 xl:px-20">
                <div className="w-full max-w-[430px]">
                    <Link
                        href={home()}
                        className="mb-10 inline-flex "
                    >
                        <AppLogo />
                    </Link>
                    <div className="mb-8 space-y-2 text-center">
                        <h2 className="text-4xl font-extrabold tracking-[-1.2px] text-[#071C55] sm:text-[42px]">
                            {title}
                        </h2>
                        <p className="mx-auto max-w-[360px] text-sm leading-5 text-[#59729E]">
                            {description}
                        </p>
                    </div>
                    {children}
                    <Link
                        href={home()}
                        className="mt-8 inline-flex items-center gap-1 text-xs text-[#59729E] transition-colors hover:text-[#1054D0]"
                    >
                        Kembali ke beranda <ArrowUpRight className="size-3.5" />
                    </Link>
                </div>
            </section>

            <section
                className="relative hidden min-h-0 overflow-hidden bg-white lg:flex lg:h-dvh"
                aria-label="Ilustrasi pembelajaran BRI Peduli"
            >
                <img
                    src="/login.png"
                    alt="Ilustrasi pembelajaran BRI Peduli"
                    className="size-full object-contain"
                />
            </section>
        </main>
    );
}
