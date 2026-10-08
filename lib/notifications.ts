import { prisma } from "@/lib/prisma";

export const NOTIFICATION_TYPES = {
    ORG_INVITATION: "ORG_INVITATION",
} as const;

interface CreateInvitationNotificationParams {
    userId: string;
    organizationId: string;
    organizationName: string;
    invitationId?: string | null;
    inviterName?: string | null;
}

/**
 * Creates an in-app notification telling `userId` they were invited to an org.
 * Never throws: the Clerk invitation (and email) has already been sent by the
 * time this runs, so a notification failure must not turn the invite into an error.
 */
export async function createInvitationNotification({
    userId,
    organizationId,
    organizationName,
    invitationId,
    inviterName,
}: CreateInvitationNotificationParams) {
    try {
        return await prisma.notification.create({
            data: {
                userId,
                type: NOTIFICATION_TYPES.ORG_INVITATION,
                title: `Invitation to join ${organizationName}`,
                message: inviterName
                    ? `${inviterName} invited you to join the ${organizationName} workspace.`
                    : `You have been invited to join the ${organizationName} workspace.`,
                organizationId,
                invitationId: invitationId ?? null,
            },
        });
    } catch (error) {
        console.error("CREATE_INVITATION_NOTIFICATION_ERROR", error);
        return null;
    }
}
