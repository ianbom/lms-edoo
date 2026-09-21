import { Link } from '@inertiajs/react';
import { Instagram, Linkedin, Youtube } from 'lucide-react';
import AppLogo from '@/components/app-logo';

export default function HomeFooter() {
    return (
        <footer className="bg-[#1054D0] text-white">
            <div className="mx-auto grid max-w-[1370px] grid-cols-[1.45fr_1fr_1.2fr_1.8fr] gap-[42px] border-t border-white/20 px-11 pt-9 pb-[45px] max-[1100px]:px-[25px] max-[760px]:grid-cols-2 max-[760px]:gap-[30px_20px] max-[760px]:px-[22px] max-[760px]:pt-[38px]">
                <div className="max-[760px]:col-span-2">
                    <Link
                        href="/"
                        className="inline-flex rounded-md bg-white px-2 py-1"
                    >
                        <AppLogo />
                    </Link>
                    <p className="text-[13px] text-[#DCEBFF]">
                        Belajar Hari Ini, Lebih Baik Esok.
                    </p>
                    <div className="mt-[19px] flex items-center gap-[17px] text-white">
                        <Linkedin size={18} />
                        <span className="text-[16px]">♥</span>
                        <Instagram size={18} />
                        <Youtube size={18} />
                    </div>
                    <small className="mt-[22px] block text-[12px] text-[#C8DEFF]">
                        © 2026 BRI Peduli. Hak cipta dilindungi.
                    </small>
                </div>

                <div>
                    <h3 className="mt-[7px] mb-3 text-sm font-bold">
                        Tautan Cepat
                    </h3>
                    {['Beranda', 'Tentang Kami', 'Kelas', 'Blog', 'Kontak'].map(
                        (item) => (
                            <a
                                href={`#${item.toLowerCase().replace(' ', '-')}`}
                                className="block text-[13px] leading-[1.7] text-[#DCEBFF] transition-colors hover:text-white"
                                key={item}
                            >
                                {item}
                            </a>
                        ),
                    )}
                </div>

                <div>
                    <h3 className="mt-[7px] mb-3 text-sm font-bold">
                        Kelas Populer
                    </h3>
                    {[
                        'Web Development',
                        'Digital Marketing',
                        'UI/UX Design',
                        'Business',
                        'Personal Development',
                    ].map((item) => (
                        <a
                            href="#courses"
                            className="block text-[13px] leading-[1.7] text-[#DCEBFF] transition-colors hover:text-white"
                            key={item}
                        >
                            {item}
                        </a>
                    ))}
                </div>

                <div className="max-[760px]:col-span-2">
                    <h3 className="mt-[7px] mb-3 text-sm font-bold">
                        Berlangganan Newsletter
                    </h3>
                    <p className="mb-3 text-[13px] text-[#DCEBFF]">
                        Dapatkan info kelas, tips, dan kabar terbaru.
                    </p>
                    <div className="flex">
                        <input
                            className="w-full min-w-0 rounded-l-[9px] border border-white bg-white px-[11px] py-[11px] text-[13px] text-[#070B49] outline-none placeholder:text-[#61719B] focus:border-[#BBD8FF] focus:ring-2 focus:ring-[#BBD8FF]"
                            type="email"
                            placeholder="Alamat email kamu"
                            aria-label="Alamat email"
                        />
                        <button
                            className="rounded-r-[9px] bg-[#071F66] px-[17px] text-[13px] font-bold text-white hover:bg-[#06194F] active:bg-[#04133D]"
                            type="button"
                        >
                            Berlangganan
                        </button>
                    </div>
                    <small className="mt-[22px] block text-[12px] text-[#C8DEFF]">
                        Membuat pendidikan lebih mudah diakses untuk masa depan yang
                        lebih cerah. <b className="text-[16px] text-white">♥</b>
                    </small>
                </div>
            </div>
        </footer>
    );
}
