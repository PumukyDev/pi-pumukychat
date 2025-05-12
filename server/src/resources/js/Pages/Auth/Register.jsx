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
        setProcessing(true);
        console.log('🚀 Form submitted');

        try {
            console.log('🔐 Generating RSA key pair...');
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

            console.log('Payload:', payload);

            router.post(route('register'), payload, {
                preserveState: false,
                onError: (err) => {
                    console.error('❌ Validation errors:', err);
                    setErrors(err);
                },
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

                <div className="flex items-center justify-end mt-4">
                    <Link
                        href={route('login')}
                        className="underline text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
                    >
                        Already registered?
                    </Link>
                    <PrimaryButton className="ms-4" disabled={processing}>
                        Register
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
