import { Link } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
import { useSelector } from "react-redux";
import { use } from "react";
import UserMenu from "../UserMenu";

const Navbar = () => {
    const { cart } = useSelector((state) => state.carts);
    const { user } = useSelector((state) => state.auth);
    // Tính tổng số lượng items trong cart
    const totalItems = cart?.reduce((total, item) => total + (item.quantity || 0), 0) || 0;

    return (
        <header className="bg-white/80 backdrop-blur-md border-b border-purple-200 sticky top-0 z-50 shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link
                        to="/"
                        className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"
                    >
                        Sellzy
                    </Link>

                    {/* Navigation */}
                    <nav className="hidden md:flex items-center gap-8">
                        <Link to="/" className="text-sm font-medium text-gray-700 hover:text-purple-600 transition-colors">
                            Home
                        </Link>
                        <Link to="/products" className="text-sm font-medium text-gray-700 hover:text-purple-600 transition-colors">
                            Products
                        </Link>
                        <Link
                            to="#categories"
                            className="text-sm font-medium text-gray-700 hover:text-purple-600 transition-colors"
                        >
                            Categories
                        </Link>
                        <Link to="#about" className="text-sm font-medium text-gray-700 hover:text-purple-600 transition-colors">
                            About
                        </Link>
                    </nav>

                    {/* Actions */}
                    <div className="flex items-center gap-4">
                        {/* Cart Icon with Badge */}
                        <Link to="/cart" className="relative">
                            <button className="relative p-2 text-gray-700 hover:text-purple-600 transition-colors">
                                <FaShoppingCart className="w-6 h-6" />
                                {totalItems > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                        {totalItems > 99 ? '99+' : totalItems}
                                    </span>
                                )}
                            </button>
                        </Link>

                        {user && user.id ? (
                            <button className="text-sm font-medium text-gray-700 hover:text-purple-600 transition-colors">
                                <UserMenu />
                            </button>
                        ) : (
                            <Link to="/login">
                                <button className="text-sm font-medium text-gray-700 hover:text-purple-600 transition-colors">
                                    Sign In
                                </button>
                            </Link>
                        )}

                    </div>
                </div>
            </div >
        </header >
    );
};

export default Navbar;

