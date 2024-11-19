import { useState } from "react";
import { BellIcon } from "lucide-react";
import { useUser } from "../../providers/AuthProvider";
import { formatTimestamp } from "../../lib/globals";
import { deleteNotification, readNotification } from "../../lib/notification";
import { useNavigate } from "react-router-dom"; // Import useNavigate

export default function Notifications() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate
  const { notifications } = useUser();

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  // Filter notifications to get the count of unread notifications
  const unreadNotifications = notifications.filter(
    (notification) => !notification.viewed
  );
  const unreadCount = unreadNotifications.length;

  const handleNotificationClick = (notification) => {
    // Mark the notification as read
    readNotification(notification.id);
    // Navigate to MyPermits
    navigate(notification.data.link); // Adjust the path as necessary
  };

  return (
    <div className="relative">
      <button onClick={toggleDropdown} className="focus:outline-none">
        <BellIcon className="w-6 h-6 text-white" />
        {unreadCount > 0 && (
          <span className="absolute top-[-8px] right-[-12px] bg-red-500 text-white rounded-full text-xs px-1">
            {unreadCount}
          </span>
        )}
      </button>
      {isOpen && (
        <div className="absolute z-50 right-[-17rem] mt-2 w-[380px] h-[20rem] max-h-[20rem] overflow-y-auto bg-white shadow-lg rounded border-2">
          <div className="p-2 font-semibold">
            You have {notifications.length} notifications
          </div>
          {notifications.map((notification) => (
            <div
              key={notification.fromId}
              className={`p-2 flex items-center ${
                !notification.viewed ? "font-bold" : ""
              }`}
              onClick={() => handleNotificationClick(notification)} // Add click handler
            >
              {!notification.viewed && (
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2" />
              )}
              <div className="flex-1 cursor-pointer"> {/* Change cursor on hover */}
                <p>{notification.message}</p>
                <span className="text-sm text-gray-500">
                  {formatTimestamp(notification.notifiedAt)}
                </span>
              </div>
              {!notification.viewed && (
                <button
                  className="text-blue-500 text-sm"
                  onClick={async (e) => {
                    e.stopPropagation(); // Prevent triggering the click on the div
                    await readNotification(notification.id);
                  }}
                >
                  Mark as Read
                </button>
              )}
              <button
                className="text-blue-500 text-sm"
                onClick={async (e) => {
                  e.stopPropagation(); // Prevent triggering the click on the div
                  await deleteNotification(notification.id);
                }}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
