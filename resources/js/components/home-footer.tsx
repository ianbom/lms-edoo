import { Link } from '@inertiajs/react';
import { Instagram, Linkedin, Youtube } from 'lucide-react';
import AppLogo from '@/components/app-logo';

export default function HomeFooter() {
    return (
        <footer className="mx-auto grid max-w-[1370px] grid-cols-[1.45fr_1fr_1.2fr_1.8fr] gap-[42px] border-t border-[#E3E8F2] px-11 pt-9 pb-[45px] max-[1100px]:px-[25px] max-[760px]:grid-cols-2 max-[760px]:gap-[30px_20px] max-[760px]:px-[22px] max-[760px]:pt-[38px]">
            <div className="max-[760px]:col-span-2">
                <Link href="/" className="inline-flex items-center">
                    <AppLogo />
                </Link>
                <p className="text-[11px] text-[#59648A]">
                    Belajar Hari Ini, Lebih Baik Esok.
                </p>
                <div className="mt-[19px] flex items-center gap-[17px] text-[#070B49]">
                    <Linkedin size={16} />
                    <span className="text-[13px]">♥</span>
                    <Instagram size={16} />
                    <Youtube size={16} />
                </div>
                <small className="mt-[22px] block text-[10px] text-[#7D89A8]">
                    © 2026 BRI Peduli. Hak cipta dilindungi.
                </small>
            </div>

            <div>
                <h3 className="mt-[7px] mb-3 text-xs font-bold">
                    Tautan Cepat
                </h3>
                {['Beranda', 'Tentang Kami', 'Kelas', 'Blog', 'Kontak'].map(
                    (item) => (
                        <a
                            href={`#${item.toLowerCase().replace(' ', '-')}`}
                            className="block text-[11px] leading-[1.7] text-[#59648A] hover:text-[#1054D0]"
                            key={item}
                        >
                            {item}
                        </a>
                    ),
                )}
            </div>

            <div>
                <h3 className="mt-[7px] mb-3 text-xs font-bold">
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
                        className="block text-[11px] leading-[1.7] text-[#59648A] hover:text-[#1054D0]"
                        key={item}
                    >
                        {item}
                    </a>
                ))}
            </div>

            <div className="max-[760px]:col-span-2">
                <h3 className="mt-[7px] mb-3 text-xs font-bold">
                    Berlangganan Newsletter
                </h3>
                <p className="mb-3 text-[11px] text-[#59648A]">
                    Dapatkan info kelas, tips, dan kabar terbaru.
                </p>
                <div className="flex">
                    <input
                        className="w-full min-w-0 rounded-l-[9px] border border-[#E3E8F2] px-[11px] py-[11px] text-[11px] outline-none placeholder:text-[#7D89A8] focus:border-[#2478E4]"
                        type="email"
                        placeholder="Alamat email kamu"
                        aria-label="Alamat email"
                    />
                    <button
                        className="rounded-r-[9px] bg-[#1054D0] px-[17px] text-[11px] font-bold text-white hover:bg-[#0C46B8] active:bg-[#093B9E]"
                        type="button"
                    >
                        Berlangganan
                    </button>
                </div>
                <small className="mt-[22px] block text-[10px] text-[#7D89A8]">
                    Membuat pendidikan lebih mudah diakses untuk masa depan yang
                    lebih cerah. <b className="text-[15px] text-[#1054D0]">♥</b>
                </small>
            </div>
        </footer>
    );
}
