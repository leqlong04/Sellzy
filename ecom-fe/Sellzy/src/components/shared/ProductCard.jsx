import { useState } from "react";
import { Link } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
import ProductViewModal from "./ProductViewModal";
import truncateText from "../../utils/truncateText";
import { useDispatch } from "react-redux";
import { addToCart } from "../../store/actions";
import toast from "react-hot-toast";
import getImageUrl from "../../utils/getImageUrl";

const ProductCard = ({
    productId,
    productName,
    image,
    description,
    quantity,
    price,
    discount,
    specialPrice,
    averageRating = 0,
    ratingCount = 0,
    sellerName = "Unknown Seller",
    trustScore = 85,
    trustLevel = "Very Good",
}) => {
    const [openProductViewModal, setOpenProductViewModal] = useState(false)
    const btnLoader = false
    const [selectedViewProduct, setSelectedViewProduct] = useState({})
    const isAvailable = quantity && Number(quantity) > 0
    const dispatch = useDispatch()

    const handleProductView = (product) => {
        setSelectedViewProduct(product)
        setOpenProductViewModal(true)
    };

    const handleAddToCart = (cartItems) => {
        dispatch(addToCart(cartItems, 1, toast));
    };

    const getTrustScoreColor = (score) => {
        if (score >= 90) return { bg: "bg-green-50", text: "text-green-700", bar: "bg-green-500" }
        if (score >= 80) return { bg: "bg-blue-50", text: "text-blue-700", bar: "bg-blue-500" }
        if (score >= 70) return { bg: "bg-yellow-50", text: "text-yellow-700", bar: "bg-yellow-500" }
        return { bg: "bg-red-50", text: "text-red-700", bar: "bg-red-500" }
    }

    const trustColors = getTrustScoreColor(trustScore)

    const ratingValue = Number(averageRating) || 0;

    const renderStars = () => {
        const stars = []
        for (let i = 1; i <= 5; i++) {
            if (i <= Math.floor(ratingValue)) {
                stars.push(
                    <span key={i} className="text-yellow-400">
                        ★
                    </span>,
                )
            } else if (i === Math.ceil(ratingValue) && ratingValue % 1 !== 0) {
                stars.push(
                    <span key={i} className="text-yellow-400">
                        ★
                    </span>,
                )
            } else {
                stars.push(
                    <span key={i} className="text-gray-300">
                        ★
                    </span>,
                )
            }
        }
        return stars
    }

    return (
        <div className="rounded-lg border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-lg bg-white">
            <div
                onClick={() =>
                    handleProductView({
                        id: productId,
                        productName,
                        image,
                        description,
                        quantity,
                        price,
                        discount,
                        specialPrice,
                        averageRating,
                        ratingCount,
                        sellerName,
                        trustScore,
                        trustLevel,
                    })
                }
                className="relative w-full overflow-hidden aspect-square bg-gray-100 cursor-pointer"
            >
                {discount && discount > 0 && (
                    <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold z-10">
                        Save ${discount.toFixed(2)}
                    </div>
                )}
                <img
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-111"
                    src={getImageUrl(image)}
                    alt={productName}
                    onError={(e) => { e.currentTarget.src = "/placeholder.svg"; }}
                />
            </div>

            <div className="p-4 space-y-3">
                <h2
                    onClick={() =>
                        handleProductView({
                            id: productId,
                            productName,
                            image,
                            description,
                            quantity,
                            price,
                            discount,
                            specialPrice,
                        averageRating,
                        ratingCount,
                        sellerName,
                            trustScore,
                            trustLevel,
                        })
                    }
                    className="text-base font-semibold cursor-pointer text-gray-900 hover:text-blue-600 transition-colors min-h-[3rem]"
                    title={productName}
                >
                    {truncateText(productName, 30)}
                </h2>

                {description && (
                    <p className="text-sm text-gray-600 min-h-[2.5rem]" title={description}>
                        {truncateText(description, 80)}
                    </p>
                )}

                <div className="flex items-center gap-1">
                    <div className="flex items-center">{renderStars()}</div>
                    <span className="text-sm text-gray-600">
                        {ratingValue.toFixed(1)} • {ratingCount} review{ratingCount === 1 ? "" : "s"}
                    </span>
                </div>

                <div className="flex items-baseline gap-2">
                    {specialPrice ? (
                        <>
                            <span className="text-2xl font-bold text-gray-900">${Number(specialPrice).toFixed(2)}</span>
                            <span className="text-sm text-gray-400 line-through">${Number(price).toFixed(2)}</span>
                        </>
                    ) : (
                        <span className="text-2xl font-bold text-gray-900">${Number(price).toFixed(2)}</span>
                    )}
                </div>

                {/* <p className="text-sm text-blue-600">by {sellerName}</p>

                <div className={`flex items-center gap-2 p-2 rounded-lg ${trustColors.bg}`}>
                    <div className="flex items-center gap-1">
                        <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                            <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                            <span className={`text-xs font-semibold ${trustColors.text}`}>Trust Score</span>
                            <span className={`text-xs font-bold ${trustColors.text}`}>{trustScore}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div className={`h-1.5 rounded-full ${trustColors.bar}`} style={{ width: `${trustScore}%` }} />
                        </div>
                        <span className={`text-xs ${trustColors.text} mt-1 block`}>{trustLevel}</span>
                    </div>
                </div> */}

                <div className="flex flex-col gap-2">
                    <button
                        disabled={!isAvailable || btnLoader}
                        onClick={() => handleAddToCart({
                            image,
                            productName,
                            description,
                            specialPrice,
                            price,
                            productId,
                            quantity
                        })}
                        className={`${isAvailable ? "bg-yellow-400 hover:bg-yellow-500 cursor-pointer" : "bg-gray-300 opacity-70"
                            } text-gray-900 py-3 px-4 rounded-lg w-full font-bold text-sm transition-all duration-300`}
                    >
                        {isAvailable ? "Add to Cart" : "Out of Stock"}
                    </button>
                    <Link
                        to={`/products/${productId}`}
                        className="text-center text-sm font-semibold text-blue-600 hover:text-blue-500 transition"
                    >
                        View details
                    </Link>
                </div>
            </div>

            <ProductViewModal
                open={openProductViewModal}
                setOpen={setOpenProductViewModal}
                product={selectedViewProduct}
                isAvailable={isAvailable}
            />
        </div>
    )
}

export default ProductCard