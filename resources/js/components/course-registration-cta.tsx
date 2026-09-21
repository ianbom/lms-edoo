import { Link } from '@inertiajs/react';
import { ArrowRight, GraduationCap } from 'lucide-react';
import { cn } from '@/lib/utils';

export function CourseRegistrationCta({
    className,
}: {
    className?: string;
}) {
    return (
        <section
            className={cn(
                'relative overflow-hidden rounded-[18px] bg-[#105BDD] px-6 py-8 text-white sm:px-9 sm:py-9',
                className,
            )}
            aria-labelledby="course-registration-cta-title"
        >
            <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <div className="max-w-2xl">
                    <div className="flex items-center gap-2 text-sm font-semibold text-white/80">
                        <GraduationCap size={18} />
                        BELAJAR BERSAMA
                    </div>
                    <h2
                        id="course-registration-cta-title"
                        className="mt-3 text-2xl font-extrabold tracking-[-0.8px] sm:text-3xl"
                    >
                        Siap mulai belajar?
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-white/85 sm:text-base">
                        Buat akun untuk mengikuti kelas pilihan, menyimpan
                        progres, dan belajar sesuai ritmemu.
                    </p>
                </div>
                <Link
                    href="/register"
                    className="inline-flex w-fit items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-bold text-[#105BDD] transition hover:bg-[#EAF4FF] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                    Daftar Sekarang
                    <ArrowRight size={18} />
                </Link>
            </div>
            <div
                className="pointer-events-none absolute -right-20 -bottom-28 size-64 rounded-full border-[28px] border-white/10"
                aria-hidden="true"
            />
            <div
                className="pointer-events-none absolute -top-16 right-1/3 size-32 rounded-full border-[18px] border-white/10"
                aria-hidden="true"
            />
        </section>
    );
}
