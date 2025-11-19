

import { Link } from "react-router-dom"
import { useEffect, useMemo, useState } from "react"
import ProductCard from "../shared/ProductCard"
import Navbar from "../shared/Navbar"
import HomeRecommendations from "./HomeRecommendations"
import HomeDeals from "./HomeDeals"
import HomeRecentlyViewed from "./HomeRecentlyViewed"
import { useSelector } from "react-redux"
import { fetchCategories, fetchTrendingProducts } from "../../api/products"
import {
    FaShoppingCart,
    FaShieldAlt,
    FaHeadset,
    FaCheckCircle,
    FaClipboardList,
    FaComments,
    FaStar,
    FaArrowRight,
} from "react-icons/fa"

const FALLBACK_TRENDING_PRODUCTS = [
        {
            productId: 1,
            productName: "Wireless Bluetooth Headphones",
            image: "/wireless-black-headphones-on-yellow-background.jpg",
            description: "Premium sound quality with active noise cancellation",
            quantity: 50,
            price: 99.99,
            discount: 20,
            specialPrice: 79.99,
            averageRating: 4.5,
            ratingCount: 1247,
            seller: "TechGear Pro",
            trustScore: 92,
            trustLevel: "Excellent",
        },
        {
            productId: 2,
            productName: "Premium Cotton T-Shirt",
            image: "/white-cotton-tshirt-on-person.jpg",
            description: "Soft, breathable cotton for everyday comfort",
            quantity: 100,
            price: 24.99,
            discount: 0,
            specialPrice: null,
            averageRating: 4,
            ratingCount: 856,
            seller: "Fashion Forward",
            trustScore: 85,
            trustLevel: "Very Good",
        },
        {
            productId: 3,
            productName: "Smart Home Security Camera",
            image: "/security-camera-installation.png",
            description: "1080p HD video with night vision and motion detection",
            quantity: 30,
            price: 199.99,
            discount: 50,
            specialPrice: 149.99,
            averageRating: 4.5,
            ratingCount: 2103,
            seller: "SecureHome Tech",
            trustScore: 96,
            trustLevel: "Excellent",
        },
        {
            productId: 4,
            productName: "Organic Coffee Beans 2lb",
            image: "/coffee-beans-package.png",
            description: "Single-origin, fair-trade certified coffee beans",
            quantity: 75,
            price: 18.99,
            discount: 0,
            specialPrice: null,
            averageRating: 4.5,
            ratingCount: 743,
            seller: "Mountain Roasters",
            trustScore: 89,
            trustLevel: "Very Good",
        },
    ]

export default function HomePage() {
    const { user } = useSelector((state) => state.auth)

    const [categories, setCategories] = useState([])
    const [categoriesLoading, setCategoriesLoading] = useState(true)
    const [categoriesError, setCategoriesError] = useState(null)
    const [categoriesVersion, setCategoriesVersion] = useState(0)

    const [trendingProducts, setTrendingProducts] = useState([])
    const [trendingLoading, setTrendingLoading] = useState(true)
    const [trendingError, setTrendingError] = useState(null)
    const [trendingVersion, setTrendingVersion] = useState(0)

    useEffect(() => {
        let active = true
        const loadCategories = async () => {
            setCategoriesLoading(true)
            setCategoriesError(null)
            try {
                const data = await fetchCategories({ pageSize: 6 })
                if (!active) return
                setCategories(data?.content || [])
            } catch (error) {
                if (!active) return
                setCategoriesError(error?.response?.data?.message || "Unable to load categories")
                setCategories([])
            } finally {
                if (active) setCategoriesLoading(false)
            }
        }
        loadCategories()
        return () => {
            active = false
        }
    }, [categoriesVersion])

    useEffect(() => {
        let active = true
        const loadTrending = async () => {
            setTrendingLoading(true)
            setTrendingError(null)
            try {
                const data = await fetchTrendingProducts({ pageSize: 12, sortBy: "ratingCount", sortOrder: "desc" })
                if (!active) return
                setTrendingProducts(data?.content || [])
            } catch (error) {
                if (!active) return
                setTrendingError(error?.response?.data?.message || "Unable to load trending products")
                setTrendingProducts([])
            } finally {
                if (active) setTrendingLoading(false)
            }
        }
        loadTrending()
        return () => {
            active = false
        }
    }, [trendingVersion])

    const displayTrendingProducts = useMemo(() => {
        if (trendingProducts.length) {
            return trendingProducts
        }
        if (!trendingLoading && !trendingError) {
            return FALLBACK_TRENDING_PRODUCTS
        }
        return []
    }, [trendingProducts, trendingLoading, trendingError])

    const topDeals = useMemo(
        () => displayTrendingProducts.filter((product) => (product.discount || 0) > 0).slice(0, 8),
        [displayTrendingProducts]
    )

    const gradientPalette = [
        "from-indigo-500 via-purple-500 to-pink-500",
        "from-rose-500 via-red-500 to-orange-500",
        "from-blue-500 via-cyan-500 to-teal-500",
        "from-emerald-500 via-green-500 to-lime-500",
        "from-amber-500 via-orange-500 to-yellow-500",
        "from-fuchsia-500 via-purple-500 to-indigo-500",
    ]

    const reloadCategories = () => setCategoriesVersion((prev) => prev + 1)
    const reloadTrending = () => setTrendingVersion((prev) => prev + 1)

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
            <div className="fixed inset-0 -z-10 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-400 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
                <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
            </div>



            <section className="relative overflow-hidden py-20 lg:py-32">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-pink-500 to-orange-500 opacity-90"></div>
                <div className="absolute inset-0">
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-yellow-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
                    <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse animation-delay-2000"></div>
                </div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-4xl mx-auto">
                        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight text-balance drop-shadow-lg">
                            {user ? (
                                <>
                                    Welcome back,{" "}
                                    <span className="text-yellow-300">{user.userName}</span>. Discover picks chosen for you
                                </>
                            ) : (
                                <>
                                    Shop with confidence using <span className="text-yellow-300">AI-powered trust scores</span>
                                </>
                            )}
                        </h1>
                        <p className="text-xl text-white/90 mb-8 leading-relaxed text-pretty max-w-2xl mx-auto drop-shadow">
                            {user
                                ? "Here’s what other shoppers with similar tastes are buying today."
                                : "Discover authentic products from verified sellers. Our AI analyzes seller history, product authenticity, and review quality to help you make informed decisions."}
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link
                                to="/products"
                                className="bg-white text-purple-600 px-8 py-4 rounded-full text-base font-semibold hover:shadow-2xl hover:scale-105 transition-all w-full sm:w-auto flex items-center justify-center gap-2"
                            >
                                <FaShoppingCart /> Browse Products
                            </Link>
                            {user ? (
                                <button className="border-2 border-white text-white px-8 py-4 rounded-full text-base font-semibold hover:bg-white hover:text-purple-600 transition-all w-full sm:w-auto">
                                    Continue shopping
                                </button>
                            ) : (
                                <button className="border-2 border-white text-white px-8 py-4 rounded-full text-base font-semibold hover:bg-white hover:text-purple-600 transition-all w-full sm:w-auto">
                                    Learn More
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-16 bg-white/50 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="text-center bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl p-6 text-white shadow-xl hover:scale-105 transition-transform">
                            <FaShieldAlt className="w-12 h-12 mx-auto mb-3" />
                            <div className="text-4xl font-bold mb-2">1M+</div>
                            <div className="text-sm opacity-90">Verified Products</div>
                        </div>
                        <div className="text-center bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl p-6 text-white shadow-xl hover:scale-105 transition-transform">
                            <FaStar className="w-12 h-12 mx-auto mb-3" />
                            <div className="text-4xl font-bold mb-2">98%</div>
                            <div className="text-sm opacity-90">Customer Satisfaction</div>
                        </div>
                        <div className="text-center bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-6 text-white shadow-xl hover:scale-105 transition-transform">
                            <FaCheckCircle className="w-12 h-12 mx-auto mb-3" />
                            <div className="text-4xl font-bold mb-2">50K+</div>
                            <div className="text-sm opacity-90">Trusted Sellers</div>
                        </div>
                        <div className="text-center bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl p-6 text-white shadow-xl hover:scale-105 transition-transform">
                            <FaHeadset className="w-12 h-12 mx-auto mb-3" />
                            <div className="text-4xl font-bold mb-2">24/7</div>
                            <div className="text-sm opacity-90">Customer Support</div>
                        </div>
                    </div>
                </div>
            </section>

            <section id="categories" className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-12">
                        <div className="text-left">
                            <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                                Shop by Category
                            </h2>
                            <p className="text-lg text-gray-600">Explore our most-loved collections</p>
                        </div>
                        <div className="flex items-center gap-3">
                            {categoriesError && (
                                <span className="text-sm text-rose-500 hidden sm:inline">
                                    {categoriesError}
                                </span>
                            )}
                            <button
                                type="button"
                                onClick={reloadCategories}
                                className="inline-flex items-center gap-2 text-sm font-semibold text-purple-600 hover:text-purple-500"
                            >
                                Refresh
                            </button>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
                        {categoriesLoading
                            ? Array.from({ length: 6 }).map((_, index) => (
                                <div
                                    key={index}
                                    className="h-40 rounded-3xl bg-slate-100 animate-pulse"
                                ></div>
                            ))
                            : categories.length > 0
                                ? categories.map((category, index) => {
                                    const gradient = gradientPalette[index % gradientPalette.length]
                                    return (
                                        <Link
                                            key={category.categoryId}
                                            to={`/products?categories=${encodeURIComponent(category.categoryName)}`}
                                            className={`relative overflow-hidden rounded-3xl p-6 text-white bg-gradient-to-br ${gradient} shadow-lg hover:shadow-2xl transition-all`}
                                        >
                                            <div className="absolute inset-0 opacity-20 bg-white blur-3xl"></div>
                                            <div className="relative space-y-4">
                                                <p className="text-xs uppercase tracking-[0.3em] text-white/80">
                                                    Category
                                                </p>
                                                <h3 className="text-2xl font-semibold leading-tight">
                                                    {category.categoryName}
                                                </h3>
                                                <span className="inline-flex items-center gap-2 text-sm font-semibold text-white/90">
                                                    Explore <FaArrowRight className="w-3 h-3" />
                                                </span>
                                            </div>
                                        </Link>
                                    )
                                })
                                : (
                                    <div className="col-span-full text-center text-sm text-slate-500">
                                        {categoriesError || "No categories available yet."}
                                    </div>
                                )}
                    </div>
                </div>
            </section>

            <section className="py-20 bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-6 leading-tight">
                                AI-Powered Trust Scoring for Every Purchase
                            </h2>
                            <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                                Our advanced AI analyzes seller history, product authenticity, and review quality to provide trust
                                scores. Higher scores indicate more reliable and authentic products.
                            </p>
                            <div className="space-y-6">
                                <div className="flex items-start gap-4 bg-white rounded-xl p-4 shadow-lg hover:shadow-xl transition-shadow">
                                    <div className="bg-gradient-to-br from-green-500 to-emerald-500 text-white rounded-full p-3 flex-shrink-0">
                                        <FaCheckCircle className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-800 mb-1">Seller Verification</h3>
                                        <p className="text-gray-600">We verify seller credentials and track their performance history</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4 bg-white rounded-xl p-4 shadow-lg hover:shadow-xl transition-shadow">
                                    <div className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white rounded-full p-3 flex-shrink-0">
                                        <FaClipboardList className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-800 mb-1">Product Authenticity</h3>
                                        <p className="text-gray-600">AI checks product details against known authentic items</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4 bg-white rounded-xl p-4 shadow-lg hover:shadow-xl transition-shadow">
                                    <div className="bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-full p-3 flex-shrink-0">
                                        <FaComments className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-800 mb-1">Review Quality Analysis</h3>
                                        <p className="text-gray-600">We analyze review patterns to detect fake or biased reviews</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-3xl p-8 shadow-2xl border-2 border-purple-200">
                            <div className="space-y-6">
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-semibold text-gray-800">Excellent (90-100%)</span>
                                        <span className="text-sm font-bold text-green-600">96%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                                        <div
                                            className="h-4 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 shadow-lg"
                                            style={{ width: "96%" }}
                                        />
                                    </div>
                                    <p className="text-xs text-gray-600 mt-1">Highly trusted sellers with verified products</p>
                                </div>
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-semibold text-gray-800">Very Good (80-89%)</span>
                                        <span className="text-sm font-bold text-blue-600">85%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                                        <div
                                            className="h-4 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 shadow-lg"
                                            style={{ width: "85%" }}
                                        />
                                    </div>
                                    <p className="text-xs text-gray-600 mt-1">Reliable sellers with good track records</p>
                                </div>
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-semibold text-gray-800">Good (70-79%)</span>
                                        <span className="text-sm font-bold text-yellow-600">75%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                                        <div
                                            className="h-4 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 shadow-lg"
                                            style={{ width: "75%" }}
                                        />
                                    </div>
                                    <p className="text-xs text-gray-600 mt-1">Decent sellers with room for improvement</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <HomeRecommendations />
            <HomeDeals
                items={topDeals}
                loading={trendingLoading}
                error={trendingError}
                onRetry={reloadTrending}
            />
            <HomeRecentlyViewed />

            <section className="py-20 bg-white/50 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-12">
                        <div>
                            <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                                Trending Products
                            </h2>
                            <p className="text-lg text-gray-600">Discover what shoppers love right now</p>
                        </div>
                        <div className="flex items-center gap-3">
                            {trendingError && (
                                <span className="text-sm text-rose-500 hidden sm:inline">{trendingError}</span>
                            )}
                            <button
                                type="button"
                                onClick={reloadTrending}
                                className="inline-flex items-center gap-2 text-sm font-semibold text-purple-600 hover:text-purple-500"
                            >
                                Refresh
                            </button>
                            <Link
                                to="/products"
                                className="hidden md:inline-flex items-center gap-2 text-purple-600 font-semibold hover:gap-3 transition-all"
                            >
                                View All <FaArrowRight />
                            </Link>
                        </div>
                    </div>
                    {trendingLoading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {Array.from({ length: 4 }).map((_, index) => (
                                <div key={index} className="h-72 rounded-3xl bg-slate-100 animate-pulse"></div>
                            ))}
                        </div>
                    ) : displayTrendingProducts.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {displayTrendingProducts.slice(0, 8).map((product) => (
                                <ProductCard key={product.productId} {...product} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-sm text-slate-500 text-center">
                            {trendingError || "No trending products right now."}
                        </div>
                    )}
                    <div className="text-center mt-8 md:hidden">
                        <Link
                            to="/products"
                            className="inline-flex items-center gap-2 text-purple-600 font-semibold hover:gap-3 transition-all"
                        >
                            View All Products <FaArrowRight />
                        </Link>
                    </div>
                </div>
            </section>

            <section className="py-20 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white relative overflow-hidden">
                <div className="absolute inset-0">
                    <div className="absolute top-0 left-1/3 w-96 h-96 bg-yellow-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
                    <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse animation-delay-2000"></div>
                </div>
                <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-4xl font-bold mb-4 drop-shadow-lg">Ready to shop with confidence?</h2>
                    <p className="text-xl mb-8 opacity-90 drop-shadow">
                        Join thousands of satisfied customers who trust our AI-powered platform
                    </p>
                    <Link
                        to="/products"
                        className="inline-flex items-center gap-2 bg-white text-purple-600 px-8 py-4 rounded-full text-base font-semibold hover:shadow-2xl hover:scale-105 transition-all"
                    >
                        <FaShoppingCart /> Start Shopping Now
                    </Link>
                </div>
            </section>

            <footer className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
                        <div>
                            <h3 className="font-semibold mb-4 text-purple-400">Shop</h3>
                            <ul className="space-y-2">
                                <li>
                                    <Link to="/products" className="text-gray-300 hover:text-purple-400 transition-colors">
                                        All Products
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/products" className="text-gray-300 hover:text-purple-400 transition-colors">
                                        New Arrivals
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/products" className="text-gray-300 hover:text-purple-400 transition-colors">
                                        Best Sellers
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-4 text-pink-400">Company</h3>
                            <ul className="space-y-2">
                                <li>
                                    <Link href="#about" className="text-gray-300 hover:text-pink-400 transition-colors">
                                        About Us
                                    </Link>
                                </li>
                                <li>
                                    <Link href="#" className="text-gray-300 hover:text-pink-400 transition-colors">
                                        Careers
                                    </Link>
                                </li>
                                <li>
                                    <Link href="#" className="text-gray-300 hover:text-pink-400 transition-colors">
                                        Contact
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-4 text-blue-400">Support</h3>
                            <ul className="space-y-2">
                                <li>
                                    <Link href="#" className="text-gray-300 hover:text-blue-400 transition-colors">
                                        Help Center
                                    </Link>
                                </li>
                                <li>
                                    <Link href="#" className="text-gray-300 hover:text-blue-400 transition-colors">
                                        Shipping Info
                                    </Link>
                                </li>
                                <li>
                                    <Link href="#" className="text-gray-300 hover:text-blue-400 transition-colors">
                                        Returns
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-4 text-green-400">Legal</h3>
                            <ul className="space-y-2">
                                <li>
                                    <Link href="#" className="text-gray-300 hover:text-green-400 transition-colors">
                                        Privacy Policy
                                    </Link>
                                </li>
                                <li>
                                    <Link href="#" className="text-gray-300 hover:text-green-400 transition-colors">
                                        Terms of Service
                                    </Link>
                                </li>
                                <li>
                                    <Link href="#" className="text-gray-300 hover:text-green-400 transition-colors">
                                        Cookie Policy
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-gray-700 pt-8 text-center text-gray-400">
                        <p>© 2025 TrustShop. All rights reserved.</p>
                    </div>
                </div>
            </footer>

            <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
        </div>
    )
}
