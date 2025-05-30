import { useEffect, useState } from "react";
import ApplicationLogo from "@/Components/ApplicationLogo";
import Dropdown from "@/Components/Dropdown";
import NavLink from "@/Components/NavLink";
import ResponsiveNavLink from "@/Components/ResponsiveNavLink";
import ThemeToggle from "@/Components/App/ThemeToggle";
import { Link, usePage } from "@inertiajs/react";
import Echo from "laravel-echo";
import { useEventBus } from "@/EventBus";
import Toast from "@/Components/App/Toast";
import NewMessageNotification from "@/Components/App/NewMessageNotification";

// Layout for authenticated users, includes navigation, real-time listeners, and notifications
export default function Authenticated({ header, children }) {
    const page = usePage();
    const user = page.props.auth.user;
    const conversations = page.props.conversations;

    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);
    const { emit } = useEventBus();

    // Setup Echo listeners for each conversation and group deletion
    useEffect(() => {
        conversations.forEach((conversation) => {
            let channel = `message.group.${conversation.id}`;
            if (conversation.is_user) {
                channel = `message.user.${[parseInt(user.id), parseInt(conversation.id)].sort((a, b) => a - b).join("-")}`;
            }

            window.Echo.private(channel)
                .error(console.error)
                .listen("SocketMessage", (event) => {
                    const message = event.message;
                    emit("message.created", message);
                    if (message.sender_id !== user.id) {
                        emit("newMessageNotification", {
                            user: message.sender,
                            group_id: message.group_id,
                            message: message.message || `Shared ${message.attachments.length === 1 ? "an attachment" : `${message.attachments.length} attachments`}`,
                        });
                    }
                });

            if (conversation.is_group) {
                window.Echo.private(`group.deleted.${conversation.id}`)
                    .listen("GroupDeleted", (e) => {
                        emit("group.deleted", { id: e.id, name: e.name });
                    })
                    .error(console.error);
            }
        });

        // Cleanup listeners on unmount
        return () => {
            conversations.forEach((conversation) => {
                let channel = `message.group.${conversation.id}`;
                if (conversation.is_user) {
                    channel = `message.user.${[parseInt(user.id), parseInt(conversation.id)].sort((a, b) => a - b).join("-")}`;
                }
                window.Echo.leave(channel);
                if (conversation.is_group) {
                    window.Echo.leave(`group.deleted.${conversation.id}`);
                }
            });
        };
    }, [conversations]);

    return (
        <>
            <div className="min-h-screen h-screen bg-base-100 text-base-content flex flex-col overflow-hidden">
                {/* Top navigation bar */}
                <nav className="bg-base-100 border-b border-base-300">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between h-16">
                            <div className="flex">
                                {/* Logo section */}
                                <div className="shrink-0 flex items-center">
                                    <Link href="/">
                                        <ApplicationLogo className="block h-14 w-auto fill-current text-base-content" />
                                    </Link>
                                </div>

                                {/* Main navigation links */}
                                <div className="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex">
                                    <NavLink
                                        href={route("dashboard")}
                                        active={route().current("dashboard")}
                                        className={({ isActive }) =>
                                            `text-sm font-medium transition ${
                                                isActive ? "text-base-content" : "text-base-content/60"
                                            } hover:text-primary`
                                        }
                                    >
                                        Dashboard
                                    </NavLink>
                                </div>
                            </div>

                            {/* User dropdown menu */}
                            <div className="hidden sm:flex sm:items-center sm:ms-6 gap-4">
                                <div className="relative">
                                    <Dropdown>
                                        <Dropdown.Trigger>
                                            <span className="inline-flex rounded-md">
                                                <button
                                                    type="button"
                                                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-base-content/60 bg-base-100 hover:text-base-content focus:outline-none"
                                                >
                                                    {user.name}
                                                    <svg
                                                        className="ms-2 -me-0.5 h-4 w-4 text-base-content"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 0 20 20"
                                                        fill="currentColor"
                                                    >
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                </button>
                                            </span>
                                        </Dropdown.Trigger>
                                        <Dropdown.Content>
                                            <Dropdown.Link href={route("profile.edit")}>Profile</Dropdown.Link>
                                            <Dropdown.Link href={route("logout")} method="post" as="button">Log Out</Dropdown.Link>
                                        </Dropdown.Content>
                                    </Dropdown>
                                </div>

                                {/* Theme toggle button on far right */}
                                <ThemeToggle />
                            </div>

                            {/* Hamburger menu for small screens */}
                            <div className="-me-2 flex items-center sm:hidden">
                                <div className="me-4">
                                    <ThemeToggle />
                                </div>
                                <button
                                    onClick={() => setShowingNavigationDropdown(!showingNavigationDropdown)}
                                    className="inline-flex items-center justify-center p-2 rounded-md text-base-content hover:text-primary hover:bg-base-200 focus:outline-none focus:bg-base-200 focus:text-primary transition duration-150 ease-in-out"
                                >
                                    <svg className="h-6 w-6 text-base-content" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path
                                            className={!showingNavigationDropdown ? "inline-flex" : "hidden"}
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M4 6h16M4 12h16M4 18h16"
                                        />
                                        <path
                                            className={showingNavigationDropdown ? "inline-flex" : "hidden"}
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Responsive navigation dropdown */}
                    <div className={(showingNavigationDropdown ? "block" : "hidden") + " sm:hidden"}>
                        <div className="pt-2 pb-3 space-y-1">
                            <ResponsiveNavLink
                                href={route("dashboard")}
                                active={route().current("dashboard")}
                                className={({ isActive }) =>
                                    `block px-4 py-2 text-base transition ${
                                        isActive ? "font-medium text-base-content" : "text-base-content/60"
                                    } hover:text-primary`
                                }
                            >
                                Dashboard
                            </ResponsiveNavLink>
                        </div>

                        <div className="pt-4 pb-1 border-t border-base-300">
                            <div className="px-4">
                                <div className="font-medium text-base text-base-content">{user.name}</div>
                                <div className="font-medium text-sm text-base-content/60">{user.email}</div>
                            </div>

                            <div className="mt-3 space-y-1">
                                <ResponsiveNavLink href={route("profile.edit")}>Profile</ResponsiveNavLink>
                                <ResponsiveNavLink method="post" href={route("logout")} as="button">
                                    Log Out
                                </ResponsiveNavLink>
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Optional header section */}
                {header && (
                    <header className="bg-base-100 shadow">
                        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                            {header}
                        </div>
                    </header>
                )}

                {/* Main content area */}
                {children}
            </div>

            {/* Global toast and new message notification components */}
            <Toast />
            <NewMessageNotification />
        </>
    );
}
