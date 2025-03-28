"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { IoHomeOutline, IoLogOutOutline } from "react-icons/io5";
import { BsLightbulb, BsSearch, BsBarChart } from "react-icons/bs";
import { IconArrowsExchange } from "@tabler/icons-react";
import { RiListCheck2 } from "react-icons/ri";
import { AiOutlineMessage } from "react-icons/ai";
import { MdOutlineAnalytics } from "react-icons/md";
import { VscGraph } from "react-icons/vsc";
import { BiNotification } from "react-icons/bi";
import { toast } from "react-hot-toast";

const Sidebar = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const [activeItem, setActiveItem] = useState("home");

  const handleLogout = async () => {
    try {
      await signOut({ redirect: false });
      toast.success("Logged out successfully");
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to logout");
    }
  };

  const menuItems = [
    { id: "home", label: "Home", icon: IoHomeOutline },
    { id: "campaign-ideas", label: "Campaign Ideas", icon: BsLightbulb },
    { id: "search", label: "Influencer Search", icon: BsSearch },
    {
      id: "influencer-comparison",
      label: "Influencer Comparison",
      icon: IconArrowsExchange,
    },
    { id: "plans-lists", label: "Plans & Lists", icon: RiListCheck2 },
    { id: "messages", label: "Messages", icon: AiOutlineMessage },
    { id: "campaign-reports", label: "Campaign Reports", icon: BsBarChart },
    {
      id: "consolidated-reports",
      label: "Consolidated Reports",
      icon: MdOutlineAnalytics,
    },
    {
      id: "content-research",
      label: "Content Research",
      icon: VscGraph,
      badge: "New",
    },
    {
      id: "competitor-analysis",
      label: "Competitor Analysis",
      icon: BsBarChart,
    },
  ];

  return (
    <div className="sidebar">
      <div className="logo">
        <Link href="/home">
          <span className="logo-text">disco</span>
        </Link>
      </div>

      <nav className="nav-menu">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.id}
              href={`/${item.id}`}
              className={`nav-item ${activeItem === item.id ? "active" : ""}`}
              onClick={() => setActiveItem(item.id)}
            >
              <Icon className="nav-icon" />
              <span className="nav-label">{item.label}</span>
              {item.badge && <span className="badge">{item.badge}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="notifications">
        <Link href="/notifications" className="nav-item">
          <BiNotification className="nav-icon" />
          <span className="nav-label">Notifications</span>
        </Link>
      </div>

      {session && (
        <div className="logout">
          <button className="nav-item logout-button" onClick={handleLogout}>
            <IoLogOutOutline className="nav-icon" />
            <span className="nav-label">Logout</span>
          </button>
        </div>
      )}

      <div className="try-disco">
        <button className="try-button">
          TRY DISCO
          <span className="credits">3 credits remaining</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
