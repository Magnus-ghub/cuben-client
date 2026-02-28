import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";

const MobileBottomtab: React.FC = () => {
  const router = useRouter();
  const currentPath = router.pathname;

  const navItems = [
    { icon: "bi-house", label: "Home", path: "/" },
    { icon: "bi-briefcase", label: "Opps", path: "/opportunities" },
    { icon: "bi-plus-circle-fill", label: "Create", path: "/create", isCenter: true },
    { icon: "bi-shop", label: "Market", path: "/marketplace" },
    { icon: "bi-person", label: "Profile", path: "/profile" },
  ];

  return (
    <div className="mobile_bottom_nav">
      {navItems.map((item, index) => (
        <Link 
          key={index} 
          href={item.path} 
          className={`nav_item ${currentPath === item.path ? "active" : ""} ${item.isCenter ? "center_btn" : ""}`}
        >
          <i className={`bi ${item.icon}`}></i>
          {!item.isCenter && <span>{item.label}</span>}
        </Link>
      ))}
    </div>
  );
};

export default MobileBottomtab;