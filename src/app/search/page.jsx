"use client";

import { AiOutlineInstagram } from "react-icons/ai";
import { MdKeyboardArrowDown } from "react-icons/md";
import { FiSearch } from "react-icons/fi";
import CollapsibleSidebar from "../../../components/layout/CollapsibleSidebar";
import SearchSection from "../../../components/home/SearchSection";

import "../../../components/layout/MainLayout.scss";
import "../../../components/layout/Sidebar.scss";
import "../../../components/layout/CollapsibleSidebar.scss";
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
      <CollapsibleSidebar activePage="search" />

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
