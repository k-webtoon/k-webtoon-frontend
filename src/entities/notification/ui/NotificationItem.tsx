import React from "react"
import { Notification } from "../model/types"

interface NotificationItemProps {
    notification: Notification
    onClick: (id: number) => void
}

export const NotificationItem: React.FC<NotificationItemProps> = ({ notification, onClick }) => {
    return (
        <div
            className="px-4 py-2 hover:bg-gray-50 cursor-pointer"
            onClick={() => onClick(notification.id)}
        >
            {notification.label}
        </div>
    )
}