import { Head, Link } from '@inertiajs/react';
import {
    ArrowRight,
    BookOpen,
    CalendarDays,
    Clock3,
    Headphones,
    MonitorPlay,
    Quote,
    Star,
    UserRound,
    UsersRound,
    Video,
} from 'lucide-react';

const categories = [
    {
        title: 'For The Kids',
        linkLabel: 'Kids Class Online',
        image: '/welcome/class-for-kids.png',
    },
    {
        title: 'For Summertime',
        linkLabel: 'Summer Camp Online',
        image: '/welcome/class-for-summertime.png',
    },
    {
        title: 'For Adult Person',
        linkLabel: 'Adult Class Online',
        image: '/welcome/class-for-adults.png',
    },
];

const popularCourses = [
    {
        category: 'Technology',
        title: 'Full-Stack Web Development',
        description:
            'Build modern web applications through hands-on projects and live mentorship.',
        instructor: 'Alex Carter',
        role: 'Senior Software Engineer',
        duration: '12 Weeks',
        rating: '4.9',
        reviews: '2.1K',
        image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=80',
    },
    {
        category: 'Design',
        title: 'UI/UX Design Fundamentals',
        description:
            'Learn how to design intuitive digital products and build a professional portfolio.',
        instructor: 'Marcus Chen',
        role: 'Product Designer',
        duration: '8 Weeks',
        rating: '4.8',
        reviews: '1.9K',
        image: 'https://images.unsplash.com/photo-1545235617-9465d2a55698?auto=format&fit=crop&w=900&q=80',
    },
    {
        category: 'Marketing',
        title: 'Digital Marketing Essentials',
        description:
            'Master content, social media, advertising, and campaign strategy.',
        instructor: 'Sophia Lee',
        role: 'Digital Marketing Strategist',
        duration: '6 Weeks',
        rating: '4.9',
        reviews: '3.2K',
        image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80',
    },
];

const instructors = [
    {
        name: 'Alex Carter',
        role: 'Senior Software Engineer',
        specialty: 'Web Development',
        image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=500&q=80',
    },
    {
        name: 'Sophia Lee',
        role: 'Digital Marketing Strategist',
        specialty: 'Digital Marketing',
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=500&q=80',
    },
    {
        name: 'Marcus Chen',
        role: 'Product Designer',
        specialty: 'UI/UX Design',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=500&q=80',
    },
];

const testimonials = [
    {
        quote: 'The live classes are amazing! The instructors explain everything clearly and the community is so supportive.',
        name: 'Jessica Taylor',
        role: 'Web Developer',
        image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    },
    {
        quote: 'I gained practical skills and confidence to switch careers. The learning experience is top-notch!',
        name: 'Michael Brown',
        role: 'Marketing Specialist',
        image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80',
    },
    {
        quote: 'High-quality content, great instructors, and very flexible schedule. Highly recommended!',
        name: 'Priya Sharma',
        role: 'UX Designer',
        image: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=300&q=80',
    },
];

const primaryLinkClass =
    'inline-flex items-center gap-2 text-[13px] font-bold text-[#1054D0] transition hover:text-[#0C46B8]';
const sectionClass =
    'mx-auto max-w-[1370px] px-11 py-[72px] max-[1100px]:px-[25px] max-[760px]:px-[22px] max-[760px]:py-[55px]';
const kickerClass =
    'relative block pl-[27px] text-[10px] font-bold tracking-[1.2px] text-[#1054D0] before:absolute before:left-0 before:top-[5px] before:h-0.5 before:w-5 before:bg-[#1054D0]';

export default function Welcome() {
    return (
        <>
            <Head title="Eduo - Live Online Training" />
            <section
                className="relative mx-auto flex aspect-[2048/1148] max-w-[1370px] overflow-hidden bg-[#070B49] max-[1100px]:mx-[18px] max-[760px]:mx-2.5 max-[760px]:aspect-auto max-[760px]:h-[480px]"
                id="home"
            >
                <img
                    className="block size-full object-cover max-[760px]:object-[34%_center]"
                    src="/welcome/hero-online-training.png"
                    alt="Expert instructor teaching a live online class"
                />
                <h1 className="sr-only">
                    Our Live Online Training Is Taught By Expert Instructors
                </h1>
                <Link
                    className="absolute top-[58%] left-[10.3%] z-[4] h-[9%] w-[27%] rounded-full focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[#2478E4] max-[760px]:left-[8%] max-[760px]:h-[10%] max-[760px]:w-[52%]"
                    href="#classes"
                    aria-label="Browse our course catalog"
                />
            </section>

            <section
                className="mx-auto grid max-w-[1370px] grid-cols-3 gap-[35px] bg-[#EEF6FF] px-11 py-[58px] max-[1100px]:mx-[18px] max-[1100px]:px-[25px] max-[1100px]:py-11 max-[760px]:mx-0 max-[760px]:block max-[760px]:px-[22px] max-[760px]:py-[35px]"
                aria-label="Eduo benefits"
            >
                {(
                    [
                        [CalendarDays, 'Class Schedule'],
                        [MonitorPlay, 'Interactive Led Online Advantage'],
                        [UsersRound, '100% Satisfaction Guaranteed'],
                    ] as const
                ).map(([Icon, title]) => (
                    <div
                        className="flex items-start gap-[18px] border-r border-[#E3E8F2] pr-[35px] last:border-r-0 max-[760px]:mb-5 max-[760px]:border-r-0 max-[760px]:border-b max-[760px]:pr-0 max-[760px]:pb-5 max-[760px]:last:mb-0 max-[760px]:last:border-b-0 max-[760px]:last:pb-0"
                        key={title}
                    >
                        <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-[10px] bg-[#DCECFC] text-[#1054D0]">
                            <Icon size={25} />
                        </span>
                        <div>
                            <h3 className="mt-1 mb-[9px] text-sm font-bold">
                                {title}
                            </h3>
                            <p className="text-xs leading-[1.65] text-[#59648A]">
                                Eduo provides engaging instructor led content
                                for people everywhere and of all ages without
                                having to leave the house.
                            </p>
                        </div>
                    </div>
                ))}
            </section>

            <section className="bg-white">
                <section className={`${sectionClass} pb-0`} id="courses">
                    <div className="mb-7 flex items-end justify-between max-[760px]:flex-col max-[760px]:items-start max-[760px]:gap-[17px]">
                        <div>
                            <span className={kickerClass}>POPULAR CLASSES</span>
                            <h2 className="mt-3 text-[clamp(28px,3vw,39px)] leading-[1.16] font-extrabold tracking-[-1.5px]">
                                Join Our Online Classes
                            </h2>
                            <p className="mt-[7px] text-[13px] leading-[1.55] text-[#59648A]">
                                Learn practical skills through live,
                                instructor-led classes designed to help you grow
                                with confidence.
                            </p>
                        </div>
                        <a href="#courses" className={primaryLinkClass}>
                            View All Classes <ArrowRight size={20} />
                        </a>
                    </div>

                    <div className="grid grid-cols-3 gap-[18px] max-[760px]:grid-cols-1">
                        {popularCourses.map((course) => (
                            <article
                                className="overflow-hidden rounded-[11px] border border-[#E3E8F2] bg-white"
                                key={course.title}
                            >
                                <div className="relative flex h-[175px] items-start overflow-hidden p-[13px]">
                                    <img
                                        className="absolute inset-0 size-full object-cover"
                                        src={course.image}
                                        alt={`${course.title} course`}
                                        loading="lazy"
                                        referrerPolicy="no-referrer"
                                    />
                                    <span className="relative z-10 rounded-full bg-white px-[13px] py-[7px] text-[11px] font-bold text-[#1054D0]">
                                        {course.category}
                                    </span>
                                </div>

                                <div className="px-4 pt-[15px]">
                                    <h3 className="mb-[7px] text-base font-bold">
                                        {course.title}
                                    </h3>
                                    <p className="mb-4 min-h-[36px] text-xs leading-[1.5] text-[#59648A]">
                                        {course.description}
                                    </p>
                                    <div className="flex items-center gap-[9px]">
                                        <span className="inline-flex size-[37px] shrink-0 items-center justify-center rounded-full bg-[#DCECFC] text-[#1054D0]">
                                            <UserRound size={18} />
                                        </span>
                                        <div>
                                            <strong className="block text-xs">
                                                {course.instructor}
                                            </strong>
                                            <small className="mt-[3px] block text-[10px] text-[#7D89A8]">
                                                {course.role}
                                            </small>
                                        </div>
                                        <div className="ml-auto grid grid-cols-[auto_auto] items-center text-xs text-[#F5A500]">
                                            <Star
                                                size={15}
                                                fill="currentColor"
                                                className="row-span-2"
                                            />
                                            <strong className="text-[#070B49]">
                                                {course.rating}
                                            </strong>
                                            <small className="text-[10px] text-[#7D89A8]">
                                                ({course.reviews})
                                            </small>
                                        </div>
                                    </div>
                                    <div className="mt-4 flex gap-2.5 border-t border-[#E3E8F2] py-[13px] text-[10px]">
                                        <span className="flex items-center gap-[5px] text-[#59648A]">
                                            <Clock3
                                                size={16}
                                                className="text-[#1054D0]"
                                            />
                                            {course.duration}
                                        </span>
                                        <span className="flex items-center gap-[5px] text-[#59648A]">
                                            <Video
                                                size={16}
                                                className="text-[#1054D0]"
                                            />
                                            Live Online
                                        </span>
                                        <a
                                            href="#contact"
                                            className="ml-auto flex items-center gap-[5px] font-bold text-[#1054D0] hover:text-[#0C46B8]"
                                        >
                                            View Class
                                            <ArrowRight size={16} />
                                        </a>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                </section>
            </section>
        </>
    );
}
