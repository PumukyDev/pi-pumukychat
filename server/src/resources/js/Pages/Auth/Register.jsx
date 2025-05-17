import { useState, useEffect } from 'react';
import GuestLayout from '@/Layouts/GuestLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, router } from '@inertiajs/react';

export default function Register() {
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const [errors, setErrors] = useState({});
    const [processing, setProcessing] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    useEffect(() => {
        return () => {
            setForm((prev) => ({
                ...prev,
                password: '',
                password_confirmation: '',
            }));
        };
    }, []);

    const submit = async (e) => {
        e.preventDefault();

        if (form.password.length < 8) {
            setErrors({
                ...errors,
                password: 'The password must be at least 8 characters.',
            });
            return;
        }

        if (form.password !== form.password_confirmation) {
            setErrors({
                ...errors,
                password: 'Passwords do not match.',
            });
            return;
        }

        setProcessing(true);

        try {
            const keyPair = await window.crypto.subtle.generateKey(
                {
                    name: 'RSA-OAEP',
                    modulusLength: 4096,
                    publicExponent: new Uint8Array([1, 0, 1]),
                    hash: 'SHA-256',
                },
                true,
                ['encrypt', 'decrypt']
            );

            const exportedPublicKey = await window.crypto.subtle.exportKey('spki', keyPair.publicKey);
            const publicKeyPem = convertBinaryToPem(exportedPublicKey, 'PUBLIC KEY');

            const exportedPrivateKey = await window.crypto.subtle.exportKey('pkcs8', keyPair.privateKey);
            const privateKeyPem = convertBinaryToPem(exportedPrivateKey, 'PRIVATE KEY');

            await storePrivateKeyInIndexedDB(privateKeyPem);

            const payload = {
                ...form,
                public_key: publicKeyPem,
            };

            router.post(route('register'), payload, {
                preserveState: false,
                onError: (err) => setErrors(err),
                onFinish: () => setProcessing(false),
            });

        } catch (error) {
            console.error('Key generation or registration error:', error);
            setProcessing(false);
        }
    };

    const convertBinaryToPem = (binaryData, label) => {
        const base64String = window.btoa(
            String.fromCharCode(...new Uint8Array(binaryData))
        );
        const chunked = base64String.match(/.{1,64}/g).join('\n');
        return `-----BEGIN ${label}-----\n${chunked}\n-----END ${label}-----`;
    };

    const storePrivateKeyInIndexedDB = (privateKeyPem) => {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open('SecureChatKeys', 1);

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains('keys')) {
                    db.createObjectStore('keys', { keyPath: 'id' });
                }
            };

            request.onsuccess = (event) => {
                const db = event.target.result;
                const transaction = db.transaction(['keys'], 'readwrite');
                const store = transaction.objectStore('keys');

                const keyEntry = {
                    id: 'private_key',
                    pem: privateKeyPem,
                };

                const putRequest = store.put(keyEntry);

                putRequest.onsuccess = () => {
                    console.log('Private key stored in IndexedDB');
                    resolve();
                };

                putRequest.onerror = (err) => {
                    console.error('Failed to store private key in IndexedDB', err);
                    reject(err);
                };
            };

            request.onerror = (err) => {
                console.error('Failed to open IndexedDB', err);
                reject(err);
            };
        });
    };

    return (
        <GuestLayout>
            <Head title="Register" />

            <form onSubmit={submit}>
                <div>
                    <InputLabel htmlFor="name" value="Name" />
                    <TextInput
                        id="name"
                        name="name"
                        value={form.name}
                        className="mt-1 block w-full"
                        autoComplete="name"
                        isFocused={true}
                        onChange={handleChange}
                        required
                    />
                    <InputError message={errors.name} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="email" value="Email" />
                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={form.email}
                        className="mt-1 block w-full"
                        autoComplete="username"
                        onChange={handleChange}
                        required
                    />
                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="password" value="Password" />
                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={form.password}
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                        onChange={handleChange}
                        required
                    />
                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="password_confirmation" value="Confirm Password" />
                    <TextInput
                        id="password_confirmation"
                        type="password"
                        name="password_confirmation"
                        value={form.password_confirmation}
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                        onChange={handleChange}
                        required
                    />
                    <InputError message={errors.password_confirmation} className="mt-2" />
                </div>

                <div className="flex items-center justify-between mt-6">
                    <div className="text-sm text-base-content/70">
                        Already registered?
                        <Link
                            href={route('login')}
                            className="ml-1 text-primary hover:underline focus:outline-none"
                        >
                            Log in
                        </Link>
                    </div>

                    <PrimaryButton className="px-4 py-2" disabled={processing}>
                        Register
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
