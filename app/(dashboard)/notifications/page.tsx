import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import DashboardTopNav from "@/components/dashboard/dashboard-top-nav";
import NotificationsView from "@/components/notifications/notifications-view";

export default async function NotificationsPage() {
    const user = await currentUser();

    if (!user) {
        redirect("/sign-in");
    }

    return (
        <>
            <DashboardTopNav firstName={user.firstName} lastName={user.lastName} />
            <NotificationsView />
        </>
    );
}
