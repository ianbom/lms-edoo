import { Form, Head } from '@inertiajs/react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { store } from '@/routes/login';
import { register } from '@/routes';

type Props = {
    status?: string;
};

export default function Login({ status }: Props) {
    return (
        <>
            <Head title='Masuk' />

            <Form
                {...store.form()}
                resetOnSuccess={['password']}
                className="flex flex-col gap-6"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-4">
                            <div className="grid gap-1.5">
                                <Label htmlFor="phone" className="sr-only">
                                    Nomor telepon
                                </Label>
                                <Input
                                    id="phone"
                                    type="tel"
                                    name="phone"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="tel"
                                    placeholder="Masukkan nomor telepon"
                                    className="h-12 rounded-full border-[#CFE2FF] bg-[#F7FBFF] px-5 text-sm text-[#071C55] shadow-none placeholder:text-[#7290BC] focus-visible:border-[#1054D0] focus-visible:ring-[#1054D0]/20"
                                />
                                <InputError message={errors.phone} />
                            </div>

                            <div className="grid gap-1.5">
                                <Label htmlFor="password" className="sr-only">
                                    Password
                                </Label>
                                <PasswordInput
                                    id="password"
                                    name="password"
                                    required
                                    tabIndex={2}
                                    autoComplete="current-password"
                                    placeholder="Masukkan password"
                                    className="h-12 rounded-full border-[#CFE2FF] bg-[#F7FBFF] px-5 text-sm text-[#071C55] shadow-none placeholder:text-[#7290BC] focus-visible:border-[#1054D0] focus-visible:ring-[#1054D0]/20"
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div className="flex items-center space-x-2 px-1">
                                <Checkbox
                                    id="remember"
                                    name="remember"
                                    tabIndex={3}
                                    className="border-[#9BC5FF] bg-white data-[state=checked]:border-[#1054D0] data-[state=checked]:bg-[#1054D0] data-[state=checked]:text-white"
                                />
                                <Label htmlFor="remember" className="text-xs text-[#59729E]">
                                    Ingat saya
                                </Label>
                            </div>

                            <Button
                                type="submit"
                                className="mt-2 h-12 w-full rounded-full bg-[#1054D0] text-sm font-semibold text-white shadow-none hover:bg-[#0C46B8] active:scale-[0.98]"
                                tabIndex={4}
                                disabled={processing}
                                data-test="login-button"
                            >
                                {processing && <Spinner />}
                                Masuk
                            </Button>
                        </div>

                        <div className="text-center text-sm text-[#59729E]">
                            Belum punya akun?{' '}
                            <TextLink
                                href={register()}
                                tabIndex={5}
                                className="text-[#1054D0] decoration-[#9BC5FF]"
                            >
                                Daftar sekarang
                            </TextLink>
                        </div>
                    </>
                )}
            </Form>

            {status && (
                <div className="mb-4 text-center text-sm font-medium text-green-600">
                    {status}
                </div>
            )}
        </>
    );
}

Login.layout = {
    title: 'Masuk ke akun Anda',
    description: 'Masukkan nomor telepon dan password untuk melanjutkan pembelajaran.',
};
