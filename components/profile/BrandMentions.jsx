"use client";

import { useState } from "react";
import { FiInfo } from "react-icons/fi";
import "./BrandMentions.scss";

const BrandMentions = () => {
  const [activeTab, setActiveTab] = useState("all");

  const tabs = [
    { id: "all", label: "All" },
    { id: "beverages", label: "Beverages" },
    { id: "entertainment", label: "Entertainment" },
    { id: "sports", label: "Sports" },
  ];

  const brands = [
    {
      id: 1,
      name: "netflix_in",
      username: "@netflix_in",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Netflix_2015_logo.svg/1200px-Netflix_2015_logo.svg.png",
      posts: 6,
      category: "entertainment",
    },
    {
      id: 2,
      name: "indiansuperleague",
      username: "@indiansuperleague",
      logo: "https://upload.wikimedia.org/wikipedia/en/thumb/5/5a/Indian_Super_League_logo.svg/1200px-Indian_Super_League_logo.svg.png",
      posts: 3,
      category: "sports",
    },
    {
      id: 3,
      name: "iifa",
      username: "@iifa",
      logo: "https://upload.wikimedia.org/wikipedia/en/thumb/7/7c/IIFA_Awards_logo.svg/1200px-IIFA_Awards_logo.svg.png",
      posts: 3,
      category: "entertainment",
    },
    {
      id: 4,
      name: "roarwithsimba",
      username: "@roarwithsimba",
      logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTN8MOwOn8-Zl4_z_bFQD-ykTcrcvgxIsCzMg&usqp=CAU",
      posts: 1,
      category: "beverages",
    },
  ];

  const filteredBrands =
    activeTab === "all"
      ? brands
      : brands.filter((brand) => brand.category === activeTab);

  return (
    <div className="brand-mentions">
      <div className="section-header">
        <h3>
          BRAND MENTIONS <FiInfo />
        </h3>
      </div>

      <div className="tabs">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={`tab ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </div>
        ))}
      </div>

      <div className="brands-container">
        <div className="brands-scroll-container">
          {filteredBrands.map((brand) => (
            <div key={brand.id} className="brand-card">
              <div className="brand-logo">
                <img
                  src={brand.logo}
                  alt={brand.name}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://via.placeholder.com/60?text=Brand";
                  }}
                />
              </div>
              <div className="brand-name">{brand.name}</div>
              <div className="brand-username">{brand.username}</div>
              <div className="post-count">{brand.posts} posts</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BrandMentions;
