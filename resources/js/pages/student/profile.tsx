import { Head, useForm } from '@inertiajs/react';
import {
    CalendarDays,
    CheckCircle2,
    KeyRound,
    Save,
    UserRound,
} from 'lucide-react';
import type { FormEvent } from 'react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type Profile = {
    id: number;
    name: string;
    phone: string;
    email: string | null;
    status: 'active' | 'deleted';
    created_at: string | null;
    updated_at: string | null;
};

const formatDate = (value: string | null): string => {
    if (!value) return 'Belum tersedia';

    return new Intl.DateTimeFormat('id-ID', {
        dateStyle: 'medium',
        timeStyle: 'short',
    }).format(new Date(value));
};

export default function StudentProfile({ profile }: { profile: Profile }) {
    const initials = profile.name
        .split(' ')
        .map((part) => part[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();
    const profileForm = useForm({
        name: profile.name,
        phone: profile.phone,
        email: profile.email ?? '',
    });
    const passwordForm = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const updateProfile = (event: FormEvent<HTMLFormElement>): void => {
        event.preventDefault();
        profileForm.patch('/student/profile', { preserveScroll: true });
    };

    const updatePassword = (event: FormEvent<HTMLFormElement>): void => {
        event.preventDefault();
        passwordForm.put('/student/profile/password', {
            preserveScroll: true,
            onSuccess: () => passwordForm.reset(),
        });
    };

    const metadata = [
        { label: 'ID Pengguna', value: `#${profile.id}`, icon: UserRound },
        {
            label: 'Status Akun',
            value: profile.status === 'active' ? 'Aktif' : 'Dihapus',
            icon: CheckCircle2,
        },
        {
            label: 'Tanggal Bergabung',
            value: formatDate(profile.created_at),
            icon: CalendarDays,
        },
        {
            label: 'Terakhir Diperbarui',
            value: formatDate(profile.updated_at),
            icon: CalendarDays,
        },
    ];

    return (
        <>
            <Head title="Profil Student" />

            <section className="px-5 pb-10 sm:px-8 lg:px-10">
                <div className="mx-auto max-w-6xl">
                    <div className="flex flex-col gap-5 rounded-2xl border border-[#dce7f5] bg-white p-6 shadow-[0_8px_24px_rgba(25,70,130,.06)] sm:flex-row sm:items-center">
                        <span className="to-primary grid size-20 shrink-0 place-items-center rounded-full bg-linear-to-br from-[#d7e9ff] text-2xl font-extrabold text-white shadow-[0_10px_24px_rgba(17,103,232,.2)]">
                            {initials}
                        </span>
                        <div className="min-w-0">
                            <p className="text-primary text-sm font-bold">
                                Profil Student
                            </p>
                            <h1 className="mt-1 truncate text-3xl font-extrabold tracking-[-0.8px] text-[#071842]">
                                {profile.name}
                            </h1>
                            <p className="mt-1 text-sm text-[#65799a]">
                                Kelola informasi akun dan keamanan profilmu.
                            </p>
                        </div>
                    </div>

                    <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
                        <div className="space-y-6">
                            <Card className="border-[#dce7f5] shadow-[0_7px_20px_rgba(25,70,130,.05)]">
                                <CardHeader>
                                    <CardTitle>Informasi Pribadi</CardTitle>
                                    <CardDescription>
                                        Perbarui nama, nomor telepon, dan email.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <form
                                        onSubmit={updateProfile}
                                        className="space-y-5"
                                    >
                                        <div className="grid gap-2">
                                            <Label htmlFor="name">
                                                Nama lengkap
                                            </Label>
                                            <Input
                                                id="name"
                                                value={profileForm.data.name}
                                                onChange={(event) =>
                                                    profileForm.setData(
                                                        'name',
                                                        event.target.value,
                                                    )
                                                }
                                                autoComplete="name"
                                                required
                                            />
                                            <InputError
                                                message={
                                                    profileForm.errors.name
                                                }
                                            />
                                        </div>

                                        <div className="grid gap-2 sm:grid-cols-2 sm:gap-4">
                                            <div className="grid gap-2">
                                                <Label htmlFor="phone">
                                                    Nomor telepon
                                                </Label>
                                                <Input
                                                    id="phone"
                                                    type="tel"
                                                    value={
                                                        profileForm.data.phone
                                                    }
                                                    onChange={(event) =>
                                                        profileForm.setData(
                                                            'phone',
                                                            event.target.value,
                                                        )
                                                    }
                                                    autoComplete="tel"
                                                    required
                                                />
                                                <InputError
                                                    message={
                                                        profileForm.errors.phone
                                                    }
                                                />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor="email">
                                                    Email
                                                </Label>
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    value={
                                                        profileForm.data.email
                                                    }
                                                    onChange={(event) =>
                                                        profileForm.setData(
                                                            'email',
                                                            event.target.value,
                                                        )
                                                    }
                                                    autoComplete="email"
                                                    placeholder="Email opsional"
                                                />
                                                <InputError
                                                    message={
                                                        profileForm.errors.email
                                                    }
                                                />
                                            </div>
                                        </div>

                                        <Button
                                            type="submit"
                                            disabled={profileForm.processing}
                                            className="bg-primary text-primary-foreground hover:bg-primary/90"
                                        >
                                            <Save />
                                            {profileForm.processing
                                                ? 'Menyimpan...'
                                                : 'Simpan Profil'}
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>

                            <Card className="border-[#dce7f5] shadow-[0_7px_20px_rgba(25,70,130,.05)]">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <KeyRound className="text-primary" />
                                        Ganti Password
                                    </CardTitle>
                                    <CardDescription>
                                        Gunakan password lama untuk mengamankan
                                        perubahan.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <form
                                        onSubmit={updatePassword}
                                        className="space-y-5"
                                    >
                                        <div className="grid gap-2">
                                            <Label htmlFor="current_password">
                                                Password saat ini
                                            </Label>
                                            <Input
                                                id="current_password"
                                                type="password"
                                                value={
                                                    passwordForm.data
                                                        .current_password
                                                }
                                                onChange={(event) =>
                                                    passwordForm.setData(
                                                        'current_password',
                                                        event.target.value,
                                                    )
                                                }
                                                autoComplete="current-password"
                                                required
                                            />
                                            <InputError
                                                message={
                                                    passwordForm.errors
                                                        .current_password
                                                }
                                            />
                                        </div>

                                        <div className="grid gap-4 sm:grid-cols-2">
                                            <div className="grid gap-2">
                                                <Label htmlFor="password">
                                                    Password baru
                                                </Label>
                                                <Input
                                                    id="password"
                                                    type="password"
                                                    value={
                                                        passwordForm.data
                                                            .password
                                                    }
                                                    onChange={(event) =>
                                                        passwordForm.setData(
                                                            'password',
                                                            event.target.value,
                                                        )
                                                    }
                                                    autoComplete="new-password"
                                                    required
                                                />
                                                <InputError
                                                    message={
                                                        passwordForm.errors
                                                            .password
                                                    }
                                                />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor="password_confirmation">
                                                    Konfirmasi password
                                                </Label>
                                                <Input
                                                    id="password_confirmation"
                                                    type="password"
                                                    value={
                                                        passwordForm.data
                                                            .password_confirmation
                                                    }
                                                    onChange={(event) =>
                                                        passwordForm.setData(
                                                            'password_confirmation',
                                                            event.target.value,
                                                        )
                                                    }
                                                    autoComplete="new-password"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <Button
                                            type="submit"
                                            disabled={passwordForm.processing}
                                            variant="outline"
                                            className="border-primary/30 text-primary hover:bg-primary/5 hover:text-primary"
                                        >
                                            <KeyRound />
                                            {passwordForm.processing
                                                ? 'Memperbarui...'
                                                : 'Perbarui Password'}
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>
                        </div>

                        <Card className="h-fit border-[#dce7f5] shadow-[0_7px_20px_rgba(25,70,130,.05)] xl:sticky xl:top-8">
                            <CardHeader>
                                <CardTitle>Data Akun</CardTitle>
                                <CardDescription>
                                    Informasi sistem yang tidak dapat diedit.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-1">
                                {metadata.map((item) => (
                                    <div
                                        key={item.label}
                                        className="flex items-start gap-3 border-b border-[#e7edf6] py-3 last:border-0"
                                    >
                                        <span className="text-primary mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg bg-[#eaf4ff]">
                                            <item.icon size={16} />
                                        </span>
                                        <div className="min-w-0">
                                            <p className="text-[11px] font-bold tracking-wide text-[#8292ad] uppercase">
                                                {item.label}
                                            </p>
                                            <p className="mt-1 text-sm font-semibold break-words text-[#18305f]">
                                                {item.value}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>
        </>
    );
}
