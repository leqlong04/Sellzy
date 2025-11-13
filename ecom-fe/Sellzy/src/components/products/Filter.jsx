"use client"
import { useEffect, useState } from "react"
import { useLocation, useNavigate, useSearchParams } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import ReactSlider from "react-slider"
import { fetchCategories } from "../../store/actions"

const Filter = () => {
    const dispatch = useDispatch();
    const { categories } = useSelector((state) => state.products);

    const [searchParams] = useSearchParams()
    const params = new URLSearchParams(searchParams)
    const pathName = useLocation().pathname
    const navigate = useNavigate()

    const [selectedCategories, setSelectedCategories] = useState([])
    const [priceRange, setPriceRange] = useState([0, 200])
    const [trustScore, setTrustScore] = useState(70)
    const [sellerRating, setSellerRating] = useState([])

    useEffect(() => {
        dispatch(fetchCategories());
    }, [dispatch]);

    useEffect(() => {
        const currentCategories = searchParams.get("categories")?.split(",") || []
        const minPrice = Number.parseInt(searchParams.get("minPrice")) || 0
        const maxPrice = Number.parseInt(searchParams.get("maxPrice")) || 200
        const minTrust = Number.parseInt(searchParams.get("trustScore")) || 70
        const ratings = searchParams.get("ratings")?.split(",") || []

        setSelectedCategories(currentCategories)
        setPriceRange([minPrice, maxPrice])
        setTrustScore(minTrust)
        setSellerRating(ratings)
    }, [searchParams])

    const handleCategoryChange = (e) => {
        const categoryName = e.target.value;
        
        if (categoryName) {
            setSelectedCategories([categoryName]);
            params.set("categories", categoryName);
        } else {
            setSelectedCategories([]);
            params.delete("categories");
        }
        navigate(`${pathName}?${params}`);
    }

    const handlePriceChange = (values) => {
        setPriceRange(values)
        params.set("minPrice", values[0])
        params.set("maxPrice", values[1])
        navigate(`${pathName}?${params}`)
    }

    const handleTrustScoreChange = (value) => {
        setTrustScore(value)
        params.set("trustScore", value)
        navigate(`${pathName}?${params}`)
    }

    const handleRatingToggle = (rating) => {
        const newRatings = sellerRating.includes(rating)
            ? sellerRating.filter((r) => r !== rating)
            : [...sellerRating, rating]

        setSellerRating(newRatings)

        if (newRatings.length > 0) {
            params.set("ratings", newRatings.join(","))
        } else {
            params.delete("ratings")
        }
        navigate(`${pathName}?${params}`)
    }

    return (
        <div className="w-full bg-gray-50 p-6 rounded-lg border border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Filters</h2>

            {/* Categories */}
            <div className="mb-8">
                <h3 className="text-base font-semibold text-gray-900 mb-4">Category</h3>
                <select
                    value={selectedCategories[0] || ""}
                    onChange={handleCategoryChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white cursor-pointer"
                >
                    <option value="">All Categories</option>
                    {categories && categories.map((category) => (
                        <option key={category.categoryId} value={category.categoryName}>
                            {category.categoryName}
                        </option>
                    ))}
                </select>
                {!categories && (
                    <p className="text-sm text-gray-500 mt-2">Loading categories...</p>
                )}
            </div>

            {/* Price Range */}
            <div className="mb-8">
                <h3 className="text-base font-semibold text-gray-900 mb-4">Price Range</h3>
                <ReactSlider
                    className="horizontal-slider"
                    thumbClassName="slider-thumb"
                    trackClassName="slider-track"
                    value={priceRange}
                    onChange={handlePriceChange}
                    min={0}
                    max={200}
                    minDistance={10}
                    pearling
                />
                <div className="flex justify-between mt-3">
                    <span className="text-sm font-medium text-gray-700">${priceRange[0]}</span>
                    <span className="text-sm font-medium text-gray-700">${priceRange[1]}</span>
                </div>
            </div>

            {/* Minimum Trust Score */}
            <div className="mb-8">
                <h3 className="text-base font-semibold text-gray-900 mb-4">Minimum Trust Score</h3>
                <ReactSlider
                    className="horizontal-slider-single"
                    thumbClassName="slider-thumb"
                    trackClassName="slider-track"
                    value={trustScore}
                    onChange={handleTrustScoreChange}
                    min={0}
                    max={100}
                />
                <div className="mt-3 text-sm font-medium text-gray-700">{trustScore}% and above</div>
            </div>

            {/* Seller Rating */}
            <div>
                <h3 className="text-base font-semibold text-gray-900 mb-4">Seller Rating</h3>
                <div className="space-y-3">
                    {["4", "3", "2"].map((rating) => (
                        <label key={rating} className="flex items-center cursor-pointer group">
                            <input
                                type="checkbox"
                                checked={sellerRating.includes(rating)}
                                onChange={() => handleRatingToggle(rating)}
                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                            />
                            <span className="ml-3 flex items-center">
                                {[...Array(Number.parseInt(rating))].map((_, i) => (
                                    <span key={i} className="text-yellow-400">
                                        ★
                                    </span>
                                ))}
                                <span className="ml-1 text-sm text-gray-700 group-hover:text-gray-900">& up</span>
                            </span>
                        </label>
                    ))}
                </div>
            </div>

            <style>{`
                .horizontal-slider {
                    width: 100%;
                    height: 6px;
                    background: #e5e7eb;
                    border-radius: 3px;
                }
                .horizontal-slider-single {
                    width: 100%;
                    height: 6px;
                    background: #e5e7eb;
                    border-radius: 3px;
                }
                .slider-thumb {
                    width: 18px;
                    height: 18px;
                    background: #1f2937;
                    border-radius: 50%;
                    cursor: pointer;
                    top: -6px;
                }
                .slider-track {
                    background: #1f2937;
                    height: 6px;
                    border-radius: 3px;
                }
            `}</style>
        </div>
    )
}

export default Filter
