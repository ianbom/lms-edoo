import { Form, Head } from '@inertiajs/react';
import { LockKeyhole, Mail, Smartphone, UserRound } from 'lucide-react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { login } from '@/routes';
import { store } from '@/routes/register';

type Props = {
    passwordRules: string;
};

export default function Register({ passwordRules }: Props) {
    return (
        <>
            <Head title="Daftar" />
            <Form
                {...store.form()}
                resetOnSuccess={['password', 'password_confirmation']}
                disableWhileProcessing
                className="flex flex-col gap-6"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-5 lg:gap-4">
                            <div className="grid gap-1.5">
                                <Label htmlFor="name" className="sr-only">
                                    Nama lengkap
                                </Label>
                                <div className="relative">
                                    <UserRound className="pointer-events-none absolute top-1/2 left-5 z-10 size-5 -translate-y-1/2 text-[#647AA9] lg:hidden" />
                                    <Input
                                        id="name"
                                        type="text"
                                        required
                                        autoFocus
                                        tabIndex={1}
                                        autoComplete="name"
                                        name="name"
                                        placeholder="Nama lengkap"
                                        className="h-14 rounded-[22px] border-[#C7DDFF] bg-[#F8FBFF] pl-13 text-base text-[#071C55] shadow-none placeholder:text-[#7185B0] focus-visible:border-[#1054D0] focus-visible:ring-[#1054D0]/20 lg:h-12 lg:rounded-full lg:px-5 lg:text-sm lg:placeholder:text-[#7290BC]"
                                    />
                                </div>
                                <InputError
                                    message={errors.name}
                                    className="mt-2"
                                />
                            </div>

                            <div className="grid gap-1.5">
                                <Label htmlFor="phone" className="sr-only">
                                    Nomor telepon
                                </Label>
                                <div className="relative">
                                    <Smartphone className="pointer-events-none absolute top-1/2 left-5 z-10 size-5 -translate-y-1/2 text-[#647AA9] lg:hidden" />
                                    <Input
                                        id="phone"
                                        type="tel"
                                        required
                                        tabIndex={2}
                                        autoComplete="tel"
                                        name="phone"
                                        placeholder="Masukkan nomor telepon"
                                        className="h-14 rounded-[22px] border-[#C7DDFF] bg-[#F8FBFF] pl-13 text-base text-[#071C55] shadow-none placeholder:text-[#7185B0] focus-visible:border-[#1054D0] focus-visible:ring-[#1054D0]/20 lg:h-12 lg:rounded-full lg:px-5 lg:text-sm lg:placeholder:text-[#7290BC]"
                                    />
                                </div>
                                <InputError message={errors.phone} />
                            </div>

                            <div className="grid gap-1.5">
                                <Label htmlFor="email" className="sr-only">
                                    Alamat email (opsional)
                                </Label>
                                <div className="relative">
                                    <Mail className="pointer-events-none absolute top-1/2 left-5 z-10 size-5 -translate-y-1/2 text-[#647AA9] lg:hidden" />
                                    <Input
                                        id="email"
                                        type="email"
                                        tabIndex={3}
                                        autoComplete="email"
                                        name="email"
                                        placeholder="Alamat email (opsional)"
                                        className="h-14 rounded-[22px] border-[#C7DDFF] bg-[#F8FBFF] pl-13 text-base text-[#071C55] shadow-none placeholder:text-[#7185B0] focus-visible:border-[#1054D0] focus-visible:ring-[#1054D0]/20 lg:h-12 lg:rounded-full lg:px-5 lg:text-sm lg:placeholder:text-[#7290BC]"
                                    />
                                </div>
                                <InputError message={errors.email} />
                            </div>

                            <div className="grid gap-1.5">
                                <Label htmlFor="password" className="sr-only">
                                    Password
                                </Label>
                                <div className="relative">
                                    <LockKeyhole className="pointer-events-none absolute top-1/2 left-5 z-10 size-5 -translate-y-1/2 text-[#647AA9] lg:hidden" />
                                    <PasswordInput
                                        id="password"
                                        required
                                        tabIndex={4}
                                        autoComplete="new-password"
                                        name="password"
                                        placeholder="Buat password"
                                        className="h-14 rounded-[22px] border-[#C7DDFF] bg-[#F8FBFF] pl-13 text-base text-[#071C55] shadow-none placeholder:text-[#7185B0] focus-visible:border-[#1054D0] focus-visible:ring-[#1054D0]/20 lg:h-12 lg:rounded-full lg:px-5 lg:text-sm lg:placeholder:text-[#7290BC]"
                                        passwordrules={passwordRules}
                                    />
                                </div>
                                <InputError message={errors.password} />
                            </div>

                            <div className="grid gap-1.5">
                                <Label
                                    htmlFor="password_confirmation"
                                    className="sr-only"
                                >
                                    Konfirmasi password
                                </Label>
                                <div className="relative">
                                    <LockKeyhole className="pointer-events-none absolute top-1/2 left-5 z-10 size-5 -translate-y-1/2 text-[#647AA9] lg:hidden" />
                                    <PasswordInput
                                        id="password_confirmation"
                                        required
                                        tabIndex={5}
                                        autoComplete="new-password"
                                        name="password_confirmation"
                                        placeholder="Ulangi password"
                                        className="h-14 rounded-[22px] border-[#C7DDFF] bg-[#F8FBFF] pl-13 text-base text-[#071C55] shadow-none placeholder:text-[#7185B0] focus-visible:border-[#1054D0] focus-visible:ring-[#1054D0]/20 lg:h-12 lg:rounded-full lg:px-5 lg:text-sm lg:placeholder:text-[#7290BC]"
                                        passwordrules={passwordRules}
                                    />
                                </div>
                                <InputError
                                    message={errors.password_confirmation}
                                />
                            </div>

                            <Button
                                type="submit"
                                className="mt-2 h-14 w-full rounded-[22px] bg-[#1054D0] text-lg font-bold text-white shadow-none hover:bg-[#0C46B8] active:scale-[0.98] lg:h-12 lg:rounded-full lg:text-sm lg:font-semibold"
                                tabIndex={6}
                                data-test="register-user-button"
                            >
                                {processing && <Spinner />}
                                Buat akun
                            </Button>
                        </div>

                        <div className="text-center text-base text-[#5D75A9] lg:text-sm lg:text-[#59729E]">
                            Sudah punya akun?{' '}
                            <TextLink
                                href={login()}
                                tabIndex={7}
                                className="font-semibold text-[#1054D0] decoration-[#9BC5FF]"
                            >
                                Masuk
                            </TextLink>
                        </div>
                    </>
                )}
            </Form>
        </>
    );
}

Register.layout = {
    title: 'Buat akun baru',
    description:
        'Daftar untuk mulai mengikuti kelas dan menyimpan progres belajar.',
};
