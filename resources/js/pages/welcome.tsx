import { Head, Link, usePage } from '@inertiajs/react';
import {
    ArrowRight,
    BookOpen,
    CalendarDays,
    ChevronDown,
    Clock3,
    Headphones,
    Instagram,
    Linkedin,
    MonitorPlay,
    Quote,
    Search,
    Star,
    UserRound,
    UsersRound,
    Video,
    Youtube,
} from 'lucide-react';
import { dashboard, login, register } from '@/routes';

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
    const { auth } = usePage().props;

    return (
        <>
            <Head title="Eduo - Live Online Training" />

            <div className="overflow-hidden bg-[#FBFCFF] text-[#070B49]">
                <header className="mx-auto flex min-h-[82px] max-w-[1370px] items-center gap-[22px] px-7 max-[1100px]:gap-[13px] max-[1100px]:px-[18px] max-[760px]:flex-wrap max-[760px]:py-[14px]">
                    <Link
                        href="/"
                        className="mr-1 flex items-center gap-[9px] text-[25px] font-extrabold tracking-[-1.3px] max-[760px]:mr-auto"
                        aria-label="Eduo home"
                    >
                        <BookOpen size={27} className="text-[#1054D0]" />
                        Eduo
                    </Link>

                    <button
                        className="flex items-center gap-[5px] border-0 bg-transparent text-[13px] whitespace-nowrap text-[#070B49] hover:text-[#1054D0] max-[760px]:hidden"
                        type="button"
                    >
                        Category <ChevronDown size={13} />
                    </button>

                    <label className="flex h-[43px] w-[174px] items-center gap-2.5 rounded-full border border-[#E3E8F2] px-4 text-[#1054D0] max-[760px]:order-3 max-[760px]:w-full">
                        <Search size={17} />
                        <input
                            className="w-full min-w-0 border-0 bg-transparent outline-none placeholder:text-[#7D89A8]"
                            type="search"
                            placeholder="Search"
                            aria-label="Search courses"
                        />
                    </label>

                    <nav
                        className="flex flex-1 items-center justify-center gap-[23px] max-[1100px]:gap-3 max-[760px]:hidden"
                        aria-label="Main navigation"
                    >
                        {['Home', 'About Us', 'Courses', 'Pages', 'Blog'].map(
                            (item, index) => (
                                <a
                                    href={`#${item.toLowerCase().replace(' ', '-')}`}
                                    key={item}
                                    className={`flex items-center gap-1 text-[13px] whitespace-nowrap text-[#070B49] hover:text-[#1054D0] ${
                                        index >= 3 ? 'max-[1100px]:hidden' : ''
                                    }`}
                                >
                                    {item} <ChevronDown size={12} />
                                </a>
                            ),
                        )}
                        <a
                            href="#contact"
                            className="text-[13px] whitespace-nowrap text-[#070B49] hover:text-[#1054D0] max-[1100px]:hidden"
                        >
                            Contact Us
                        </a>
                    </nav>

                    <button
                        className="flex items-center gap-[5px] border-0 bg-transparent text-[13px] whitespace-nowrap text-[#070B49] hover:text-[#1054D0] max-[760px]:hidden"
                        type="button"
                    >
                        English <ChevronDown size={12} />
                    </button>

                    <Link
                        className="inline-flex items-center justify-center gap-2 rounded-full bg-[#1054D0] px-5 py-3.5 text-[13px] font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#0C46B8] active:bg-[#093B9E] max-[760px]:px-[14px] max-[760px]:py-[11px] max-[760px]:text-xs"
                        href={register()}
                    >
                        Get Started <ArrowRight size={16} />
                    </Link>

                    <Link
                        className="grid size-[35px] place-items-center rounded-full bg-[#1054D0] text-white hover:bg-[#0C46B8] active:bg-[#093B9E]"
                        href={auth.user ? dashboard() : login()}
                        aria-label={auth.user ? 'Open dashboard' : 'Log in'}
                    >
                        <UserRound size={17} />
                    </Link>
                </header>

                <main>
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
                            Our Live Online Training Is Taught By Expert
                            Instructors
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
                                [
                                    MonitorPlay,
                                    'Interactive Led Online Advantage',
                                ],
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
                                        Eduo provides engaging instructor led
                                        content for people everywhere and of all
                                        ages without having to leave the house.
                                    </p>
                                </div>
                            </div>
                        ))}
                    </section>

                    <section className={sectionClass} id="classes">
                        <div className="mb-[30px] flex items-center justify-between max-[760px]:flex-col max-[760px]:items-start max-[760px]:gap-5">
                            <h2 className="text-[clamp(28px,3vw,39px)] leading-[1.16] font-extrabold tracking-[-1.5px]">
                                Join Our 780+ Live Online
                                <br />
                                Classes For Student
                            </h2>
                            <a href="#classes" className={primaryLinkClass}>
                                View Online Classes <ArrowRight size={20} />
                            </a>
                        </div>

                        <div className="grid grid-cols-3 max-[760px]:block">
                            {categories.map((category) => (
                                <article
                                    className="border-r border-[#E3E8F2] px-[38px] text-center first:pl-0 last:border-r-0 last:pr-0 max-[760px]:border-r-0 max-[760px]:border-b max-[760px]:px-0 max-[760px]:py-[30px] max-[760px]:last:border-b-0"
                                    key={category.title}
                                >
                                    <img
                                        className="mx-auto h-[180px] w-full object-contain max-[760px]:h-auto max-[760px]:max-h-[240px]"
                                        src={category.image}
                                        alt={category.title}
                                    />
                                    <h3 className="mt-[15px] mb-2.5 text-base font-bold">
                                        {category.title}
                                    </h3>
                                    <p className="mx-auto mb-[15px] max-w-[265px] text-xs leading-[1.65] text-[#59648A]">
                                        Eduo provides engaging instructor led
                                        content for people everywhere and of all
                                        ages, without.
                                    </p>
                                    <a
                                        href="#contact"
                                        className={primaryLinkClass}
                                    >
                                        {category.linkLabel}{' '}
                                        <ArrowRight size={17} />
                                    </a>
                                </article>
                            ))}
                        </div>
                    </section>

                    <section
                        className="relative mx-auto grid max-w-[1370px] grid-cols-2 gap-[38px] px-11 pt-[30px] pb-[72px] max-[1100px]:px-[25px] max-[760px]:block max-[760px]:px-[22px] max-[760px]:pt-0 max-[760px]:pb-[55px]"
                        id="about-us"
                    >
                        <div
                            className="overflow-hidden bg-[#F5F7FB]"
                            role="img"
                            aria-label="Interactive online class"
                        >
                            <img
                                className="block h-auto w-full"
                                src="/welcome/interactive-video-class.png"
                                alt="Students and instructors in an interactive online class"
                            />
                        </div>

                        <div className="max-[760px]:pt-[35px]">
                            <h2 className="text-[clamp(28px,3vw,39px)] leading-[1.16] font-extrabold tracking-[-1.5px]">
                                We Want To Give Students A
                                <br />
                                Great Interactive Experience!
                            </h2>
                            <p className="mt-4 max-w-[570px] text-sm leading-[1.6] text-[#59648A]">
                                Eduo provides engaging instructor led content
                                for people everywhere and of all ages, without
                                having to leave the house.
                            </p>

                            {(
                                [
                                    [Headphones, 'Instant Help'],
                                    [BookOpen, 'Unlimited Learning'],
                                ] as const
                            ).map(([Icon, title]) => (
                                <div
                                    className="mt-[22px] flex items-start gap-4"
                                    key={title}
                                >
                                    <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-[10px] bg-[#DCECFC] text-[#1054D0]">
                                        <Icon size={25} />
                                    </span>
                                    <div>
                                        <h3 className="mt-1 mb-[9px] text-sm font-bold">
                                            {title}
                                        </h3>
                                        <p className="max-w-[400px] text-xs leading-[1.65] text-[#59648A]">
                                            Eduo provides engaging instructor
                                            led content for people everywhere
                                            and of all ages.
                                        </p>
                                    </div>
                                </div>
                            ))}

                            <div className="mt-[22px] grid grid-cols-2 bg-[#DCECFC] p-[22px] text-center">
                                <div>
                                    <strong className="block text-[23px] text-[#1054D0]">
                                        13 Million+
                                    </strong>
                                    <span className="mt-[5px] block text-xs text-[#1054D0]">
                                        Hours of Live Interactive
                                    </span>
                                </div>
                                <div className="border-l border-[#E3E8F2]">
                                    <strong className="block text-[23px] text-[#1054D0]">
                                        3000+
                                    </strong>
                                    <span className="mt-[5px] block text-xs text-[#1054D0]">
                                        Our subject expertise
                                    </span>
                                </div>
                            </div>
                        </div>

                        <a
                            className={`${primaryLinkClass} absolute bottom-[77px] left-11 max-[1100px]:left-[25px] max-[760px]:static max-[760px]:mt-[25px]`}
                            href="#contact"
                        >
                            More About Eduo <ArrowRight size={18} />
                        </a>
                    </section>

                    <section className="bg-white">
                        <section
                            className={`${sectionClass} pb-0`}
                            id="courses"
                        >
                            <div className="mb-7 flex items-end justify-between max-[760px]:flex-col max-[760px]:items-start max-[760px]:gap-[17px]">
                                <div>
                                    <span className={kickerClass}>
                                        POPULAR CLASSES
                                    </span>
                                    <h2 className="mt-3 text-[clamp(28px,3vw,39px)] leading-[1.16] font-extrabold tracking-[-1.5px]">
                                        Join Our Online Classes
                                    </h2>
                                    <p className="mt-[7px] text-[13px] leading-[1.55] text-[#59648A]">
                                        Learn practical skills through live,
                                        instructor-led classes designed to help
                                        you grow with confidence.
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

                        <section className="mt-[72px] bg-[#EEF6FF]">
                            <div className={`${sectionClass} py-[58px]`}>
                                <div className="mb-7 flex items-end justify-between max-[760px]:flex-col max-[760px]:items-start max-[760px]:gap-[17px]">
                                    <div>
                                        <span className={kickerClass}>
                                            LEARN FROM INDUSTRY EXPERTS
                                        </span>
                                        <h2 className="mt-3 text-[clamp(28px,3vw,39px)] leading-[1.16] font-extrabold tracking-[-1.5px]">
                                            Learn From People Who Know The
                                            Industry
                                        </h2>
                                        <p className="mt-[7px] text-[13px] leading-[1.55] text-[#59648A]">
                                            Our instructors combine real-world
                                            experience with practical teaching
                                            to help you gain skills you can
                                            actually use.
                                        </p>
                                    </div>
                                    <a
                                        href="#about-us"
                                        className={primaryLinkClass}
                                    >
                                        View All Instructors
                                        <ArrowRight size={20} />
                                    </a>
                                </div>

                                <div className="grid grid-cols-3 gap-[18px] max-[760px]:grid-cols-1">
                                    {instructors.map((instructor) => (
                                        <article
                                            className="flex items-center gap-[17px] rounded-[11px] border border-[#E3E8F2] bg-white p-[11px]"
                                            key={instructor.name}
                                        >
                                            <img
                                                className="h-[142px] w-[110px] shrink-0 rounded-[9px] object-cover"
                                                src={instructor.image}
                                                alt={instructor.name}
                                                loading="lazy"
                                                referrerPolicy="no-referrer"
                                            />
                                            <div>
                                                <h3 className="mb-[3px] text-sm font-bold">
                                                    {instructor.name}
                                                </h3>
                                                <p className="mb-[14px] text-[11px] text-[#59648A]">
                                                    {instructor.role}
                                                </p>
                                                <span className="inline-block rounded-[15px] bg-[#DCECFC] px-3 py-[7px] text-[10px] text-[#1054D0]">
                                                    {instructor.specialty}
                                                </span>
                                                <div className="mt-[19px] flex items-center gap-[17px] text-[#070B49]">
                                                    <Linkedin
                                                        size={16}
                                                        fill="currentColor"
                                                    />
                                                    <span className="text-[13px]">
                                                        ♥
                                                    </span>
                                                    <Youtube
                                                        size={16}
                                                        fill="currentColor"
                                                    />
                                                </div>
                                            </div>
                                        </article>
                                    ))}
                                </div>
                            </div>
                        </section>

                        <section className={`${sectionClass} pb-[65px]`}>
                            <div className="mb-7 flex items-end justify-between max-[760px]:flex-col max-[760px]:items-start max-[760px]:gap-[17px]">
                                <div>
                                    <span className={kickerClass}>
                                        STUDENT SUCCESS
                                    </span>
                                    <h2 className="mt-3 text-[clamp(28px,3vw,39px)] leading-[1.16] font-extrabold tracking-[-1.5px]">
                                        What Our Students Say
                                    </h2>
                                </div>
                                <p className="mb-1 text-[13px] leading-[1.55] text-[#59648A]">
                                    Real stories from learners who have
                                    transformed their careers.
                                </p>
                            </div>

                            <div className="grid grid-cols-3 gap-[18px] max-[760px]:grid-cols-1">
                                {testimonials.map((testimonial) => (
                                    <article
                                        className="rounded-[11px] border border-[#E3E8F2] bg-white p-[19px]"
                                        key={testimonial.name}
                                    >
                                        <Quote
                                            size={30}
                                            fill="currentColor"
                                            className="text-[#2478E4]"
                                        />
                                        <p className="min-h-[62px] text-[13px] leading-[1.55] text-[#59648A]">
                                            {testimonial.quote}
                                        </p>
                                        <div className="flex items-center gap-2.5">
                                            <img
                                                className="size-[37px] rounded-full object-cover"
                                                src={testimonial.image}
                                                alt={testimonial.name}
                                                loading="lazy"
                                                referrerPolicy="no-referrer"
                                            />
                                            <strong className="text-xs">
                                                {testimonial.name}
                                                <small className="mt-1 block text-[10px] font-normal text-[#7D89A8]">
                                                    {testimonial.role}
                                                </small>
                                            </strong>
                                            <span className="ml-auto text-[15px] tracking-[1px] text-[#F5A500]">
                                                ★★★★★
                                            </span>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        </section>

                        <section
                            className={`${sectionClass} flex items-center gap-10 overflow-hidden rounded-[10px] bg-[#EEF6FF] py-[34px] max-[760px]:block max-[760px]:py-7`}
                        >
                            <div>
                                <span className={kickerClass}>
                                    START LEARNING TODAY
                                </span>
                                <h2 className="mt-3 text-[30px] font-extrabold max-[760px]:text-[28px]">
                                    Invest In Your Future With Eduo.
                                </h2>
                                <p className="mt-2 text-[13px] text-[#59648A]">
                                    Join thousands of learners and take the next
                                    step toward your goals.
                                </p>
                            </div>
                            <div className="relative z-10 ml-auto min-w-[165px] text-center max-[760px]:mt-[22px] max-[760px]:ml-0 max-[760px]:text-left">
                                <Link
                                    className="inline-flex items-center gap-[7px] rounded-[15px] bg-[#1054D0] px-[27px] py-[14px] text-xs font-bold text-white hover:bg-[#0C46B8] active:bg-[#093B9E]"
                                    href={register()}
                                >
                                    Get Started <ArrowRight size={17} />
                                </Link>
                                <small className="mt-[9px] block text-[10px] text-[#7D89A8]">
                                    No credit card required
                                </small>
                            </div>
                            <img
                                className="-my-[34px] -mr-[42px] h-40 w-[190px] self-end rounded-t-[80px] object-cover object-top max-[760px]:hidden"
                                src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=700&q=80"
                                alt="Student ready to learn"
                                loading="eager"
                                referrerPolicy="no-referrer"
                            />
                        </section>

                        <section className={`${sectionClass} pt-7 pb-[52px]`}>
                            <span className={kickerClass}>
                                TRUSTED BY LEARNERS AT
                            </span>
                            <div className="mt-6 flex items-center justify-between text-[#59648A] max-[760px]:flex-wrap max-[760px]:gap-[22px]">
                                {[
                                    'Google',
                                    '▦ Microsoft',
                                    '◊ airbnb',
                                    '◉ Spotify',
                                    '♙ shopify',
                                    '▣ Notion',
                                ].map((brand) => (
                                    <strong
                                        className="text-[21px] font-semibold max-[760px]:text-[17px]"
                                        key={brand}
                                    >
                                        {brand}
                                    </strong>
                                ))}
                            </div>
                        </section>

                        <footer className="mx-auto grid max-w-[1370px] grid-cols-[1.45fr_1fr_1.2fr_1.8fr] gap-[42px] border-t border-[#E3E8F2] px-11 pt-9 pb-[45px] max-[1100px]:px-[25px] max-[760px]:grid-cols-2 max-[760px]:gap-[30px_20px] max-[760px]:px-[22px] max-[760px]:pt-[38px]">
                            <div className="max-[760px]:col-span-2">
                                <Link
                                    href="/"
                                    className="flex items-center gap-[9px] text-[25px] font-extrabold tracking-[-1.3px]"
                                >
                                    <BookOpen
                                        size={28}
                                        className="text-[#1054D0]"
                                    />
                                    Eduo
                                </Link>
                                <p className="text-[11px] text-[#59648A]">
                                    Skills for a brighter tomorrow.
                                </p>
                                <div className="mt-[19px] flex items-center gap-[17px] text-[#070B49]">
                                    <Linkedin size={16} />
                                    <span className="text-[13px]">♥</span>
                                    <Instagram size={16} />
                                    <Youtube size={16} />
                                </div>
                                <small className="mt-[22px] block text-[10px] text-[#7D89A8]">
                                    © 2026 Eduo. All rights reserved.
                                </small>
                            </div>

                            <div>
                                <h3 className="mt-[7px] mb-3 text-xs font-bold">
                                    Quick Links
                                </h3>
                                {[
                                    'Home',
                                    'About Us',
                                    'Courses',
                                    'Blog',
                                    'Contact',
                                ].map((item) => (
                                    <a
                                        href={`#${item.toLowerCase().replace(' ', '-')}`}
                                        className="block text-[11px] leading-[1.7] text-[#59648A] hover:text-[#1054D0]"
                                        key={item}
                                    >
                                        {item}
                                    </a>
                                ))}
                            </div>

                            <div>
                                <h3 className="mt-[7px] mb-3 text-xs font-bold">
                                    Popular Courses
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
                                    Subscribe to Our Newsletter
                                </h3>
                                <p className="mb-3 text-[11px] text-[#59648A]">
                                    Get the latest courses, tips, and updates.
                                </p>
                                <div className="flex">
                                    <input
                                        className="w-full min-w-0 rounded-l-[9px] border border-[#E3E8F2] px-[11px] py-[11px] text-[11px] outline-none placeholder:text-[#7D89A8] focus:border-[#2478E4]"
                                        type="email"
                                        placeholder="Your email address"
                                        aria-label="Email address"
                                    />
                                    <button
                                        className="rounded-r-[9px] bg-[#1054D0] px-[17px] text-[11px] font-bold text-white hover:bg-[#0C46B8] active:bg-[#093B9E]"
                                        type="button"
                                    >
                                        Subscribe
                                    </button>
                                </div>
                                <small className="mt-[22px] block text-[10px] text-[#7D89A8]">
                                    Making education accessible for a brighter
                                    tomorrow.{' '}
                                    <b className="text-[15px] text-[#1054D0]">
                                        ♥
                                    </b>
                                </small>
                            </div>
                        </footer>
                    </section>
                </main>
            </div>
        </>
    );
}
