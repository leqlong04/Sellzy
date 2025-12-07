"use client"
import { useEffect, useState } from "react"
import { useLocation, useNavigate, useSearchParams } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import ReactSlider from "react-slider"
import { fetchCategories } from "../../store/actions"
import { FiRefreshCw } from "react-icons/fi"

const Filter = () => {
    const dispatch = useDispatch();
    const { categories } = useSelector((state) => state.products);

    const [searchParams] = useSearchParams()
    const params = new URLSearchParams(searchParams)
    const pathName = useLocation().pathname
    const navigate = useNavigate()

    const [selectedCategory, setSelectedCategory] = useState("")
    const [priceRange, setPriceRange] = useState([0, 5000])
    const [inStock, setInStock] = useState(false)
    const [onSale, setOnSale] = useState(false)

    useEffect(() => {
        dispatch(fetchCategories());
    }, [dispatch]);

    useEffect(() => {
        const category = searchParams.get("category") || ""
        const minPrice = Number.parseInt(searchParams.get("minPrice")) || 0
        const maxPrice = Number.parseInt(searchParams.get("maxPrice")) || 5000
        const stock = searchParams.get("inStock") === "true"
        const sale = searchParams.get("onSale") === "true"

        setSelectedCategory(category)
        setPriceRange([minPrice, maxPrice])
        setInStock(stock)
        setOnSale(sale)
    }, [searchParams])

    const handleCategoryChange = (e) => {
        const categoryName = e.target.value;
        setSelectedCategory(categoryName);
        
        if (categoryName) {
            params.set("category", categoryName);
        } else {
            params.delete("category");
        }
        params.set("page", "1"); // Reset to page 1
        navigate(`${pathName}?${params}`);
    }

    const handlePriceChange = (values) => {
        setPriceRange(values)
        params.set("minPrice", values[0])
        params.set("maxPrice", values[1])
        params.set("page", "1");
        navigate(`${pathName}?${params}`)
    }

    const handleStockToggle = () => {
        const newValue = !inStock;
        setInStock(newValue);
        
        if (newValue) {
            params.set("inStock", "true");
        } else {
            params.delete("inStock");
        }
        params.set("page", "1");
        navigate(`${pathName}?${params}`);
    }

    const handleSaleToggle = () => {
        const newValue = !onSale;
        setOnSale(newValue);
        
        if (newValue) {
            params.set("onSale", "true");
        } else {
            params.delete("onSale");
        }
        params.set("page", "1");
        navigate(`${pathName}?${params}`);
    }

    const handleClearAll = () => {
        setSelectedCategory("");
        setPriceRange([0, 5000]);
        setInStock(false);
        setOnSale(false);
        
        // Keep only search and page params
        const search = params.get("search");
        const newParams = new URLSearchParams();
        if (search) newParams.set("search", search);
        newParams.set("page", "1");
        
        navigate(`${pathName}?${newParams}`);
    }

    const hasActiveFilters = selectedCategory || inStock || onSale || priceRange[0] > 0 || priceRange[1] < 5000;

    return (
        <div className="w-full bg-white p-6 rounded-xl border border-slate-200 shadow-sm sticky top-4">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-900">Filters</h2>
                {hasActiveFilters && (
                    <button
                        onClick={handleClearAll}
                        className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                        <FiRefreshCw className="text-sm" />
                        Clear All
                    </button>
                )}
            </div>

            {/* Category */}
            <div className="mb-6">
                <h3 className="text-sm font-semibold text-slate-900 mb-3">Category</h3>
                <select
                    value={selectedCategory}
                    onChange={handleCategoryChange}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white cursor-pointer"
                >
                    <option value="">All Categories</option>
                    {categories && categories.map((category) => (
                        <option key={category.categoryId} value={category.categoryName}>
                            {category.categoryName}
                        </option>
                    ))}
                </select>
            </div>

            {/* Price Range */}
            <div className="mb-6">
                <h3 className="text-sm font-semibold text-slate-900 mb-3">Price Range</h3>
                <ReactSlider
                    className="price-slider"
                    thumbClassName="price-thumb"
                    trackClassName="price-track"
                    value={priceRange}
                    onChange={handlePriceChange}
                    min={0}
                    max={5000}
                    minDistance={50}
                    pearling
                />
                <div className="flex justify-between mt-3">
                    <span className="text-sm font-medium text-slate-700">${priceRange[0]}</span>
                    <span className="text-sm font-medium text-slate-700">${priceRange[1]}</span>
                </div>
            </div>

            {/* Stock Status */}
            <div className="mb-6">
                <label className="flex items-center cursor-pointer group">
                    <input
                        type="checkbox"
                        checked={inStock}
                        onChange={handleStockToggle}
                        className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500 cursor-pointer"
                    />
                    <span className="ml-3 text-sm text-slate-700 group-hover:text-slate-900 font-medium">
                        In Stock Only
                    </span>
                </label>
            </div>

            {/* On Sale */}
            <div className="mb-6">
                <label className="flex items-center cursor-pointer group">
                    <input
                        type="checkbox"
                        checked={onSale}
                        onChange={handleSaleToggle}
                        className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500 cursor-pointer"
                    />
                    <span className="ml-3 text-sm text-slate-700 group-hover:text-slate-900 font-medium">
                        On Sale
                    </span>
                </label>
            </div>

            {/* Active Filters Summary */}
            {hasActiveFilters && (
                <div className="pt-4 border-t border-slate-200">
                    <p className="text-xs text-slate-500 mb-2">Active filters:</p>
                    <div className="flex flex-wrap gap-2">
                        {selectedCategory && (
                            <span className="inline-flex items-center px-2 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-medium">
                                {selectedCategory}
                            </span>
                        )}
                        {(priceRange[0] > 0 || priceRange[1] < 5000) && (
                            <span className="inline-flex items-center px-2 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-medium">
                                ${priceRange[0]}-${priceRange[1]}
                            </span>
                        )}
                        {inStock && (
                            <span className="inline-flex items-center px-2 py-1 rounded-md bg-green-50 text-green-700 text-xs font-medium">
                                In Stock
                            </span>
                        )}
                        {onSale && (
                            <span className="inline-flex items-center px-2 py-1 rounded-md bg-rose-50 text-rose-700 text-xs font-medium">
                                On Sale
                            </span>
                        )}
                    </div>
                </div>
            )}

            <style>{`
                .price-slider {
                    width: 100%;
                    height: 6px;
                    background: #e2e8f0;
                    border-radius: 3px;
                }
                .price-thumb {
                    width: 20px;
                    height: 20px;
                    background: #3b82f6;
                    border: 2px solid white;
                    box-shadow: 0 2px 6px rgba(0,0,0,0.15);
                    border-radius: 50%;
                    cursor: grab;
                    top: -7px;
                }
                .price-thumb:active {
                    cursor: grabbing;
                }
                .price-track {
                    background: #3b82f6;
                    height: 6px;
                    border-radius: 3px;
                }
            `}</style>
        </div>
    )
}

export default Filter
