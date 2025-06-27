import {
  AlignCenter,
  Calendar,
  CreditCard,
  Settings,
  Timer,
} from "lucide-react";

export type QuickAction =
  | "bookingsList"
  | "calendar"
  | "widgets"
  | "settings"
  | "availability";

interface QuickActionsProps {
  onChange: (value: QuickAction) => void;
  currentAction?: QuickAction;
}

export default function QuickActions({
  onChange,
  currentAction,
}: QuickActionsProps) {
  return (
    <div className="bg-base-100 rounded-box shadow-lg overflow-hidden border border-base-300">
      <div className="bg-primary text-primary-content p-4">
        <h2 className="text-xl font-bold">Quick Actions</h2>
      </div>
      <ul className="menu bg-base-100 w-full p-2 rounded-box">
        {" "}
        <li>
          <button
            className={`flex items-center gap-3 ${
              currentAction === "bookingsList"
                ? "bg-base-200 text-base-content font-medium"
                : ""
            }`}
            onClick={() => {
              onChange("bookingsList");
            }}
          >
            <AlignCenter className="w-5 h-5" />
            <span>View Bookings List</span>
          </button>
        </li>{" "}
        <li>
          <button
            className={`flex items-center gap-3 ${
              currentAction === "calendar"
                ? "bg-base-200 text-base-content font-medium"
                : ""
            }`}
            onClick={() => {
              onChange("calendar");
            }}
          >
            <Calendar className="w-5 h-5" />
            <span>View Calendar</span>
          </button>
        </li>
        <li>
          <button
            className={`flex items-center gap-3 ${
              currentAction === "widgets"
                ? "bg-base-200 text-base-content font-medium"
                : ""
            }`}
            onClick={() => {
              onChange("widgets");
            }}
          >
            <CreditCard className="w-5 h-5" />
            <span>Edit Widgets</span>
          </button>
        </li>
        <li>
          <button
            className={`flex items-center gap-3 ${
              currentAction === "availability"
                ? "bg-base-200 text-base-content font-medium"
                : ""
            }`}
            onClick={() => {
              onChange("availability");
            }}
          >
            <Timer className="w-5 h-5" />
            <span>Manage Availability</span>
          </button>
        </li>
        <li>
          <button
            className={`flex items-center gap-3 ${
              currentAction === "settings"
                ? "bg-base-200 text-base-content font-medium"
                : ""
            }`}
            onClick={() => {
              onChange("settings");
            }}
          >
            <Settings className="w-5 h-5" />
            <span>Settings</span>
          </button>
        </li>
      </ul>
    </div>
  );
}
