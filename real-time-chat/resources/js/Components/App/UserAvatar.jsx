const UserAvatar = ({ user, online = null, profile = false }) => {
    // Determine online status class: 'online', 'offline', or empty
    let onlineClass =
        online === true ? "online" : online === false ? "offline" : "";

    // Choose size class depending on whether it's shown on a profile view
    const sizeClass = profile ? "w-40" : "w-8";

    return (
        <>
            {/* If the user has an avatar image, display it */}
            {user.avatar_url && (
                <div className={`chat-image avatar ${onlineClass}`}>
                    <div className={`rounded-full ${sizeClass}`}>
                        <img src={user.avatar_url} />
                    </div>
                </div>
            )}

            {/* If not, show a placeholder with the user's initial */}
            {!user.avatar_url && (
                <div className={`chat-image avatar placeholder ${onlineClass}`}>
                    <div className={`bg-gray-400 text-gray-800 rounded-full ${sizeClass}`}>
                        <span className="text-xl">
                            {user.name.substring(0, 1)}
                        </span>
                    </div>
                </div>
            )}
        </>
    );
};

export default UserAvatar;
