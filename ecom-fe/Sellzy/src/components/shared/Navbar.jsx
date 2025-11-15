import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { FaShoppingCart, FaStore } from "react-icons/fa";
import { FiMenu, FiX, FiSearch, FiInfo, FiShoppingBag } from "react-icons/fi";
import { AiOutlineHome } from "react-icons/ai";
import { BiCategoryAlt } from "react-icons/bi";
import UserMenu from "../UserMenu";

const Navbar = () => {
  const { cart } = useSelector((state) => state.carts);
  const { user } = useSelector((state) => state.auth);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchExpanded, setSearchExpanded] = useState(false);
  const searchInputRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const totalItems =
    cart?.reduce((total, item) => total + (item.quantity || 0), 0) || 0;

  useEffect(() => {
    if (location.pathname.startsWith("/products")) {
      const params = new URLSearchParams(location.search);
      setSearchTerm(params.get("search") || "");
      setSearchExpanded(Boolean(params.get("search")));
    }
  }, [location.pathname, location.search]);

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    const trimmed = searchTerm.trim();
    const params = new URLSearchParams();
    if (trimmed.length > 0) {
      params.set("search", trimmed);
    }
    navigate(`/products?${params.toString()}`);
    setMenuOpen(false);
    setSearchExpanded(true);
  };

  const navLinks = [
    { to: "/", label: "Home", icon: AiOutlineHome },
    { to: "/products", label: "Products", icon: FiShoppingBag },
    { to: "/#categories", label: "Categories", icon: BiCategoryAlt },
    { to: "/sellers", label: "Sellers", icon: FaStore },
    { to: "/#about", label: "About", icon: FiInfo },
  ];

  const toggleMenu = () => setMenuOpen((prev) => !prev);
  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-purple-200 sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              className="md:hidden p-2 text-gray-700 hover:text-purple-600 transition"
              onClick={toggleMenu}
              aria-label="Toggle navigation"
            >
              {menuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
            </button>
            <Link
              to="/"
              className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"
              onClick={closeMenu}
            >
              Sellzy
            </Link>
          </div>

          <div className="flex items-center gap-4">
            {searchExpanded ? (
              <form
                onSubmit={handleSearchSubmit}
                className="flex items-center bg-slate-100 rounded-full pl-3 pr-4 py-2 w-48 sm:w-56 md:w-64 border border-transparent focus-within:border-purple-200 transition-all duration-300"
              >
                <FiSearch size={18} className="text-slate-500" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search products..."
                  className="ml-2 flex-1 bg-transparent outline-none text-sm text-slate-700"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  onBlur={() => {
                    if (searchTerm.trim() === "") {
                      setSearchExpanded(false);
                    }
                  }}
                  autoFocus
                />
              </form>
            ) : (
              <button
                type="button"
                className="flex items-center justify-center w-9 h-9 rounded-full bg-slate-100 text-slate-600 hover:text-purple-600 transition"
                onClick={() => {
                  setSearchExpanded(true);
                  requestAnimationFrame(() => searchInputRef.current?.focus());
                }}
                aria-label="Open search"
              >
                <FiSearch size={18} />
              </button>
            )}
          <Link to="/cart" className="relative text-gray-700 hover:text-purple-600 transition">
              <FaShoppingCart className="w-6 h-6" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems > 99 ? "99+" : totalItems}
                </span>
              )}
            </Link>
            {user && user.id ? (
              <UserMenu />
            ) : (
              <Link
                to="/login"
                className="text-sm font-medium text-gray-700 hover:text-purple-600 transition-colors"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>

        <nav className="hidden md:flex items-center justify-center gap-8 mt-4">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              className="text-sm font-medium text-gray-700 hover:text-purple-600 transition-colors"
              onClick={closeMenu}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {menuOpen && (
          <div className="md:hidden mt-3 pb-4 border-t border-purple-100">
            <nav className="grid grid-cols-5 gap-3 pt-3">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.label}
                    to={link.to}
                    onClick={closeMenu}
                    className="flex flex-col items-center justify-center text-purple-600 hover:text-purple-500 transition"
                  >
                    <Icon size={20} />
                    <span className="text-[10px] mt-1 text-slate-500">
                      {link.label}
                    </span>
                  </Link>
                );
              })}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;

