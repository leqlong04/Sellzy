import { useState } from "react"
import ProductCard from "../shared/ProductCard"
import Filter from "./Filter"
import Loader from "../shared/Loader"

export default function Page() {
    const [sortBy, setSortBy] = useState("best-match")

    // Sample product data matching the image
    const products = [
        {
            productId: 1,
            productName: "Wireless Bluetooth Headphones",
            image: "/images (1).jpg",
            description: "Premium wireless headphones with noise cancellation and 30-hour battery life",
            quantity: 50,
            price: 99.99,
            discount: 20.0,
            specialPrice: 79.99,
            rating: 4,
            reviewCount: 1247,
            seller: "TechGear Pro",
            trustScore: 92,
            trustLevel: "Excellent",
        },
        {
            productId: 2,
            productName: "Premium Cotton T-Shirt",
            image: "/images (2).jpg",
            description: "100% organic cotton t-shirt with comfortable fit",
            quantity: 100,
            price: 24.99,
            specialPrice: null,
            rating: 3.5,
            reviewCount: 856,
            seller: "Fashion Forward",
            trustScore: 85,
            trustLevel: "Very Good",
        },
        {
            productId: 3,
            productName: "Smart Home Security Camera",
            image: "/images (3).jpg",
            description: "1080p HD security camera with night vision and motion detection",
            quantity: 30,
            price: 199.99,
            discount: 50.0,
            specialPrice: 149.99,
            rating: 4.5,
            reviewCount: 2103,
            seller: "SecureHome Tech",
            trustScore: 96,
            trustLevel: "Excellent",
        },
        {
            productId: 4,
            productName: "Organic Coffee Beans 2lb",
            image: "/images (4).jpg",
            description: "Premium organic coffee beans, medium roast",
            quantity: 75,
            price: 18.99,
            specialPrice: null,
            rating: 4.5,
            reviewCount: 743,
            seller: "Mountain Roasters",
            trustScore: 89,
            trustLevel: "Very Good",
        },
    ]

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar Filter */}
                    <div className="lg:col-span-1">
                        <Filter />
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-3">
                        {/* Header */}
                        <div className="flex justify-between items-center mb-6">
                            <h1 className="text-3xl font-bold text-gray-900">Featured Products</h1>
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-600">1-24 of 1,000+ results</span>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="best-match">Best Match</option>
                                    <option value="price-low-high">Price: Low to High</option>
                                    <option value="price-high-low">Price: High to Low</option>
                                    <option value="customer-rating">Customer Rating</option>
                                    <option value="trust-score">Trust Score</option>
                                </select>
                            </div>
                        </div>

                        {/* AI Trust Scoring Banner */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-start gap-3">
                            <div className="flex-shrink-0">
                                <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                                    />
                                </svg>
                            </div>
                            <div>
                                <h3 className="font-semibold text-blue-900 mb-1">AI Trust Scoring</h3>
                                <p className="text-sm text-blue-800">
                                    Our AI analyzes seller history, product authenticity, and review quality to provide trust scores.
                                    Higher scores indicate more reliable and authentic products.
                                </p>
                            </div>
                        </div>

                        {/* Product Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {products.map((product) => (
                                <ProductCard key={product.productId} {...product} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
