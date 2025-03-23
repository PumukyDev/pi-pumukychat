import { UsersIcon } from "@heroicons/react/24/solid";

const GroupAvatar = () => {
    return (
        <div className="avatar placeholder">
            <div className="bg-gray-400 text-gray-800 rounded-full w-8 h-8 flex items-center justify-center">
                <UsersIcon className="w-4 h-4" />
            </div>
        </div>
    );
};

export default GroupAvatar;
