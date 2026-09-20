import HomeFooter from '@/components/home-footer';
import HomeNavbar from '@/components/home-navbar';

export default function HomeLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="overflow-x-clip bg-[#FBFCFF] text-[#070B49]">
            <HomeNavbar />
            <main>{children}</main>
            <HomeFooter />
        </div>
    );
}
