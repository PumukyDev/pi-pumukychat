import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import DeleteUserForm from "./Partials/DeleteUserForm";
import UpdatePasswordForm from "./Partials/UpdatePasswordForm";
import UpdateProfileInformationForm from "./Partials/UpdateProfileInformationForm";
import { Head } from "@inertiajs/react";

function Edit({ auth, mustVerifyEmail, status }) {
    return (
        <>
            <Head title="Profile" />

            <div className="h-full overflow-auto bg-base-100 text-base-content px-4 sm:px-6 lg:px-8 py-12">
                <div className="max-w-4xl mx-auto space-y-12 pb-12">
                    <div className="p-6 bg-base-200 rounded-lg shadow-md">
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                            className="max-w-xl"
                        />
                    </div>

                    <div className="p-6 bg-base-200 rounded-lg shadow-md">
                        <UpdatePasswordForm className="max-w-xl" />
                    </div>

                    <div className="p-6 bg-base-200 rounded-lg shadow-md">
                        <DeleteUserForm className="max-w-xl" />
                    </div>
                </div>
            </div>
        </>
    );
}

Edit.layout = (page) => {
    return (
        <AuthenticatedLayout
            user={page.props.auth.user}
            header={
                <h2 className="font-semibold text-xl text-base-content leading-tight">
                    Profile
                </h2>
            }
            children={page}
        />
    );
};

export default Edit;
