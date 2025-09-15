"use client";

import { AiOutlineInstagram, AiOutlineMessage } from "react-icons/ai";
import { MdKeyboardArrowDown, MdOutlineAnalytics } from "react-icons/md";
import { FiSearch } from "react-icons/fi";
import {
  BsLightbulb,
  BsSearch,
  BsBarChart,
} from "react-icons/bs";
import { IconArrowsExchange } from "@tabler/icons-react";
import { RiListCheck2 } from "react-icons/ri";
import { VscGraph } from "react-icons/vsc";
import { BiNotification } from "react-icons/bi";
import { IoHomeOutline } from "react-icons/io5";
import Link from "next/link";
import SearchSection from "../../../components/home/SearchSection";

import "../../../components/layout/MainLayout.scss";
import "../../../components/layout/Sidebar.scss";
import "../../../components/home/SearchSection.scss";
import "../../../components/home/SearchDropdown.scss";
import "./search.scss";

const SearchPage = () => {

  const categories = [
    {
      id: "bling",
      name: "Exclusive Bling Talents",
      type: "Entertainment",
      count: 54,
      profiles: [
        { id: 1, image: "https://via.placeholder.com/40" },
        { id: 2, image: "https://via.placeholder.com/40" },
        { id: 3, image: "https://via.placeholder.com/40" },
        { id: 4, image: "https://via.placeholder.com/40" },
      ],
    },
    {
      id: "comedians",
      name: "Comedians",
      type: "Entertainment",
      count: 17,
      profiles: [
        { id: 1, image: "https://via.placeholder.com/40" },
        { id: 2, image: "https://via.placeholder.com/40" },
        { id: 3, image: "https://via.placeholder.com/40" },
        { id: 4, image: "https://via.placeholder.com/40" },
      ],
    },
    {
      id: "male-tv",
      name: "Male TV Presenters",
      type: "Entertainment",
      count: 13,
      profiles: [
        { id: 1, image: "https://via.placeholder.com/40" },
        { id: 2, image: "https://via.placeholder.com/40" },
        { id: 3, image: "https://via.placeholder.com/40" },
        { id: 4, image: "https://via.placeholder.com/40" },
      ],
    },
    {
      id: "female-tv",
      name: "Female TV Presenters",
      type: "Entertainment",
      count: 25,
      profiles: [
        { id: 1, image: "https://via.placeholder.com/40" },
        { id: 2, image: "https://via.placeholder.com/40" },
        { id: 3, image: "https://via.placeholder.com/40" },
        { id: 4, image: "https://via.placeholder.com/40" },
      ],
    },
    {
      id: "dancers",
      name: "Dancers",
      type: "Entertainment",
      count: 34,
      profiles: [
        { id: 1, image: "https://via.placeholder.com/40" },
        { id: 2, image: "https://via.placeholder.com/40" },
        { id: 3, image: "https://via.placeholder.com/40" },
        { id: 4, image: "https://via.placeholder.com/40" },
      ],
    },
    {
      id: "female-musicians",
      name: "Female Musicians",
      type: "Entertainment",
      count: 28,
      profiles: [
        { id: 1, image: "https://via.placeholder.com/40" },
        { id: 2, image: "https://via.placeholder.com/40" },
        { id: 3, image: "https://via.placeholder.com/40" },
        { id: 4, image: "https://via.placeholder.com/40" },
      ],
    },
    {
      id: "male-musicians",
      name: "Male Musicians",
      type: "Entertainment",
      count: 26,
      profiles: [
        { id: 1, image: "https://via.placeholder.com/40" },
        { id: 2, image: "https://via.placeholder.com/40" },
        { id: 3, image: "https://via.placeholder.com/40" },
        { id: 4, image: "https://via.placeholder.com/40" },
      ],
    },
    {
      id: "female-rjs",
      name: "Female RJs",
      type: "General",
      count: 32,
      profiles: [
        { id: 1, image: "https://via.placeholder.com/40" },
        { id: 2, image: "https://via.placeholder.com/40" },
        { id: 3, image: "https://via.placeholder.com/40" },
        { id: 4, image: "https://via.placeholder.com/40" },
      ],
    },
    {
      id: "male-rjs",
      name: "Male RJs",
      type: "General",
      count: 18,
      profiles: [
        { id: 1, image: "https://via.placeholder.com/40" },
        { id: 2, image: "https://via.placeholder.com/40" },
        { id: 3, image: "https://via.placeholder.com/40" },
        { id: 4, image: "https://via.placeholder.com/40" },
      ],
    },
    {
      id: "female-actors-andhra",
      name: "Female Actors from Andhra/Telangana",
      type: "Entertainment",
      count: 40,
      profiles: [
        { id: 1, image: "https://via.placeholder.com/40" },
        { id: 2, image: "https://via.placeholder.com/40" },
        { id: 3, image: "https://via.placeholder.com/40" },
        { id: 4, image: "https://via.placeholder.com/40" },
      ],
    },
    {
      id: "female-actors-karnataka",
      name: "Female Actors from Karnataka",
      type: "Entertainment",
      count: 34,
      profiles: [
        { id: 1, image: "https://via.placeholder.com/40" },
        { id: 2, image: "https://via.placeholder.com/40" },
        { id: 3, image: "https://via.placeholder.com/40" },
        { id: 4, image: "https://via.placeholder.com/40" },
      ],
    },
    {
      id: "female-actors-kerala",
      name: "Female Actors from Kerala",
      type: "Entertainment",
      count: 85,
      profiles: [
        { id: 1, image: "https://via.placeholder.com/40" },
        { id: 2, image: "https://via.placeholder.com/40" },
        { id: 3, image: "https://via.placeholder.com/40" },
        { id: 4, image: "https://via.placeholder.com/40" },
      ],
    },
  ];

  return (
    <div className="search-page-container">
      <div className="collapsible-sidebar">
        <div className="logo">
          <Link href="/home">
            <span className="logo-text">disco</span>
          </Link>
        </div>

        <nav className="nav-menu">
          <Link href="/home" className="nav-item">
            <IoHomeOutline className="nav-icon" />
            <span className="nav-label">Home</span>
          </Link>
          <Link href="/campaign-ideas" className="nav-item">
            <BsLightbulb className="nav-icon" />
            <span className="nav-label">Campaign Ideas</span>
          </Link>
          <Link href="/search" className="nav-item active">
            <BsSearch className="nav-icon" />
            <span className="nav-label">Influencer Search</span>
          </Link>
          <Link href="/influencer-comparison" className="nav-item">
            <IconArrowsExchange className="nav-icon" />
            <span className="nav-label">Influencer Comparison</span>
          </Link>
          <Link href="/plans-lists" className="nav-item">
            <RiListCheck2 className="nav-icon" />
            <span className="nav-label">Plans & Lists</span>
          </Link>
          <Link href="/messages" className="nav-item">
            <AiOutlineMessage className="nav-icon" />
            <span className="nav-label">Messages</span>
            <span className="badge">3</span>
          </Link>
          <Link href="/campaign-reports" className="nav-item">
            <BsBarChart className="nav-icon" />
            <span className="nav-label">Campaign Reports</span>
          </Link>
          <Link href="/consolidated-reports" className="nav-item">
            <MdOutlineAnalytics className="nav-icon" />
            <span className="nav-label">Consolidated Reports</span>
          </Link>
          <Link href="/content-research" className="nav-item">
            <VscGraph className="nav-icon" />
            <span className="nav-label">Content Research</span>
            <span className="badge">New</span>
          </Link>
          <Link href="/competitor-analysis" className="nav-item">
            <BsBarChart className="nav-icon" />
            <span className="nav-label">Competitor Analysis</span>
          </Link>
        </nav>

        <div className="notifications">
          <Link href="/notifications" className="nav-item">
            <BiNotification className="nav-icon" />
            <span className="nav-label">Notifications</span>
          </Link>
        </div>

        <div className="try-disco">
          <button className="try-button">
            TRY DISCO
            <span className="credits">3 credits remaining</span>
          </button>
        </div>
      </div>

      <main className="search-content">
        <div className="search-header">
          <SearchSection />
        </div>

        <div className="influencer-lists-section">
          <div className="section-header">
            <h2>✨ Influencer lists, curated for you!</h2>

            <div className="filters">
              <div className="filter-dropdown">
                <span>All Platforms</span>
                <MdKeyboardArrowDown />
              </div>

              <div className="filter-dropdown">
                <span>All Category</span>
                <MdKeyboardArrowDown />
              </div>

              <button className="search-button">
                <FiSearch />
              </button>
            </div>
          </div>

          <div className="card-grid">
            {categories.map((category) => (
              <div key={category.id} className="category-card">
                <div className="card-tag">
                  {category.type === "Entertainment"
                    ? "🎭 Entertainment"
                    : "📱 General"}
                </div>
                <h3>{category.name}</h3>

                <div className="influencer-avatars">
                  {category.profiles.map((profile) => (
                    <div key={profile.id} className="avatar">
                      <img src={profile.image} alt="Influencer" />
                    </div>
                  ))}
                  <div className="count">+{category.count}</div>
                </div>

                <div className="instagram-badge">
                  <AiOutlineInstagram className="instagram-icon" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default SearchPage;
