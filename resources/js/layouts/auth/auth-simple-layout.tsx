import { Link } from '@inertiajs/react';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    const isLogin = title === 'Masuk ke akun Anda';

    return (
        <main className="relative max-h-dvh min-h-dvh overflow-x-hidden overflow-y-auto bg-white lg:grid lg:h-dvh lg:grid-cols-[minmax(420px,0.9fr)_minmax(0,1.1fr)] lg:overflow-hidden">
            <section className="relative flex min-w-0 justify-center bg-white px-5 py-8 sm:px-10 lg:h-dvh lg:items-center lg:overflow-hidden lg:px-14 lg:py-8 xl:px-20">
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -top-20 -left-24 size-56 rounded-full bg-[#EAF5FF] blur-3xl lg:hidden"
                />
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute top-56 -right-20 size-36 rotate-45 rounded-[3rem] bg-[#EDF7FF] lg:hidden"
                />
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-20 -bottom-16 size-64 rounded-full bg-[#E8F4FF] blur-2xl lg:hidden"
                />
                <div className="relative z-10 w-full max-w-[430px]">
                    <Link
                        href={home()}
                        className="mb-8 flex justify-center lg:mb-10 lg:inline-flex"
                    >
                        <span className="[&_img]:h-12 lg:[&_img]:h-9 [&>div]:h-12 [&>div]:w-[120px] lg:[&>div]:h-9 lg:[&>div]:w-[90px]">
                            <AppLogo />
                        </span>
                    </Link>
                    <div className="mb-5 space-y-2 text-center lg:mb-8">
                        <p className="text-lg font-medium text-[#5D75A9] lg:hidden">
                            {isLogin
                                ? 'Selamat datang kembali'
                                : 'Mulai perjalanan belajarmu'}
                        </p>
                        <h2 className="text-[32px] leading-tight font-extrabold tracking-[-1px] text-[#071C55] sm:text-[38px] lg:text-4xl lg:tracking-[-1.2px] xl:text-[42px]">
                            {title}
                        </h2>
                        <p className="mx-auto max-w-[360px] text-base leading-6 text-[#5D75A9] lg:text-sm lg:leading-5 lg:text-[#59729E]">
                            {description}
                        </p>
                    </div>
                    <img
                        src="/asset-mobile.png"
                        alt="Ilustrasi pembelajaran BRI Peduli"
                        className="mx-auto mb-2 w-full max-w-[390px] lg:hidden"
                    />
                    <div className="rounded-[30px] border border-[#D9E9FF] bg-white p-5 shadow-[0_18px_45px_rgba(35,112,213,0.12)] sm:p-7 lg:rounded-none lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none">
                        {children}
                    </div>
                    <p className="mx-auto mt-10 max-w-[330px] text-center text-xl leading-7 font-medium tracking-tight text-[#071C55] lg:hidden">
                        Belajar jadi lebih mudah dan terarah bersama{' '}
                        <span className="font-extrabold text-[#1054D0]">
                            BRI Peduli
                        </span>
                    </p>
                    <Link
                        href={home()}
                        className="mt-8 flex items-center justify-center gap-2 text-base text-[#5D75A9] transition-colors hover:text-[#1054D0] lg:inline-flex lg:justify-start lg:gap-1 lg:text-xs lg:text-[#59729E]"
                    >
                        <ArrowLeft className="size-5 lg:hidden" />
                        Kembali ke beranda
                        <ArrowUpRight className="hidden size-3.5 lg:block" />
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
