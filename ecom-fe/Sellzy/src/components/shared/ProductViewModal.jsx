import { Button, Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { Divider } from '@mui/material';
import { useState } from 'react'
import { MdClose, MdDone } from 'react-icons/md';
import Status from './Status';
import getImageUrl from "../../utils/getImageUrl";

function ProductViewModal({ open, setOpen, product, isAvailable }) {
    const {
        id,
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
    } = product

    const ratingValue = Number(averageRating) || 0;

    const renderStars = () => {
        const stars = []
        for (let i = 1; i <= 5; i++) {
            if (i <= Math.floor(ratingValue)) {
                stars.push(
                    <span key={i} className="text-yellow-400 text-xl">
                        ★
                    </span>,
                )
            } else if (i === Math.ceil(ratingValue) && ratingValue % 1 !== 0) {
                stars.push(
                    <span key={i} className="text-yellow-400 text-xl">
                        ★
                    </span>,
                )
            } else {
                stars.push(
                    <span key={i} className="text-gray-300 text-xl">
                        ★
                    </span>,
                )
            }
        }
        return stars
    }

    const getTrustScoreColor = (score) => {
        if (score >= 90) return { bg: "bg-green-100", text: "text-green-700", bar: "bg-green-500" }
        if (score >= 80) return { bg: "bg-blue-100", text: "text-blue-700", bar: "bg-blue-500" }
        if (score >= 70) return { bg: "bg-yellow-100", text: "text-yellow-700", bar: "bg-yellow-500" }
        return { bg: "bg-red-100", text: "text-red-700", bar: "bg-red-500" }
    }

    const trustColors = getTrustScoreColor(trustScore)

    return (
        <Dialog open={open} as="div" className="relative z-[70]" onClose={() => setOpen(false)}>
            <DialogBackdrop className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300" />

            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div className="flex min-h-full items-center justify-center p-4">
                    <DialogPanel
                        transition
                        className="relative transform overflow-hidden rounded-2xl bg-white shadow-2xl transition-all md:max-w-[450px] md:min-w-[500px] h-[700px] w-full"
                    >
                        {image && (
                            <div className="relative flex justify-center aspect-[16/9] overflow-hidden bg-gray-100">
                                {discount && discount > 0 && (
                                    <div className="absolute top-4 left-4 bg-red-500 text-white px-4 py-2 rounded-full text-sm font-bold z-10">
                                        Save ${discount.toFixed(2)}
                                    </div>
                                )}
                                <img className="w-full h-full object-cover"  src={getImageUrl(image)} alt={productName} onError={(e) => { e.currentTarget.src = "/placeholder.svg"; }} />
                            </div>
                        )}

                        <div className="px-8 pt-6 pb-4">
                            <DialogTitle as="h1" className="text-2xl font-bold text-gray-900 mb-4">
                                {productName}
                            </DialogTitle>

                            <div className="flex items-center gap-2 mb-4">
                                <div className="flex items-center">{renderStars()}</div>
                                <span className="text-sm text-gray-600">
                                    {ratingValue.toFixed(1)} • {ratingCount} review{ratingCount === 1 ? "" : "s"}
                                </span>
                            </div>

                            <div className="space-y-4 text-gray-700 pb-6">
                                <div className="flex items-center justify-between gap-3">
                                    {specialPrice ? (
                                        <div className="flex items-center gap-3">
                                            <span className="text-3xl font-bold text-gray-900">${Number(specialPrice).toFixed(2)}</span>
                                            <span className="text-lg text-gray-400 line-through">${Number(price).toFixed(2)}</span>
                                        </div>
                                    ) : (
                                        <span className="text-3xl font-bold text-gray-900">${Number(price).toFixed(2)}</span>
                                    )}

                                    {isAvailable ? (
                                        <Status text="In Stock" icon={MdDone} bg="bg-green-100" color="text-green-700" />
                                    ) : (
                                        <Status text="Out-of-Stock" icon={MdClose} bg="bg-red-100" color="text-rose-700" />
                                    )}
                                </div>

                                <p className="text-sm text-blue-600 font-medium">by {sellerName}</p>

                                {/* <div className={`p-4 rounded-lg ${trustColors.bg}`}>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className={`text-sm font-semibold ${trustColors.text}`}>Trust Score</span>
                                        <span className={`text-lg font-bold ${trustColors.text}`}>{trustScore}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                                        <div className={`h-2 rounded-full ${trustColors.bar}`} style={{ width: `${trustScore}%` }} />
                                    </div>
                                    <span className={`text-sm ${trustColors.text}`}>{trustLevel}</span>
                                </div> */}

                                <div className="h-px bg-gray-200"></div>

                                <p className="text-sm leading-relaxed text-gray-600">{description}</p>
                            </div>
                        </div>

                        <div className="px-8 py-5 bg-gray-50 flex justify-end gap-4 border-t border-gray-200">
                            <button
                                onClick={() => setOpen(false)}
                                type="button"
                                className="px-6 py-2.5 text-sm font-semibold text-gray-700 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-300"
                            >
                                Close
                            </button>
                            <button
                                disabled={!isAvailable}
                                className={`${isAvailable ? "bg-yellow-400 hover:bg-yellow-500 cursor-pointer" : "bg-gray-300 opacity-70"
                                    } text-gray-900 px-6 py-2.5 rounded-lg font-bold text-sm transition-all duration-300`}
                            >
                                {isAvailable ? "Add to Cart" : "Out of Stock"}
                            </button>
                        </div>
                    </DialogPanel>
                </div>
            </div>
        </Dialog>
    )
}

export default ProductViewModal
