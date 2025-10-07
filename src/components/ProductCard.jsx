import { useState } from "react";
import { FaShoppingCart } from "react-icons/fa";
import ProductViewModal from "./ProductViewModal";

const ProductCard = (
    {
        productId,
        productName,
        image,
        description,
        quantity,
        price,
        discount,
        specialPrice
    }
) => {
    const [openProductViewModal, setOpenProductViewModal] = useState(false);
    const btnLoader = false;
    const [selectedViewProduct, setSelectedViewProduct] = useState("");
    const isAvailable = quantity && Number(quantity) > 0;

    const handleProductView = (product) => {
        setSelectedViewProduct(product);
        setOpenProductViewModal(true);
    }

    return (
        <div className="max-w-[300px] mx-auto border rounded-lg shadow-xl overflow-hidden transition-transform hover:shadow-2xl duration-300">


            <div onClick={() => handleProductView({
                id: productId,
                productName,
                image,
                description,
                quantity,
                price,
                discount,
                specialPrice
            })}
                className="w-full overflow-hidden aspect-[3/2]">
                <img className="w-full h-full cursor-pointer transition-transform duration-300 hover:scale-105" src={image} alt={productName}>
                </img>
            </div>
            <div className="p-4">
                <h2 onClick={() => handleProductView({
                    id: productId,
                    productName,
                    image,
                    description,
                    quantity,
                    price,
                    discount,
                    specialPrice
                })}
                    className="text-lg font-semibold mb-2 cursor-pointer">
                    {productName}
                </h2>
                <div className="min-h-20 max-h-20">
                    <p className="text-sm text-gray-600">{description}</p>
                </div>

                <div className="flex items-center justify-between">
                    {specialPrice ? (
                        <div className="flex flex-col">
                            <span className="text-gray-400 line-through font-medium">
                                ${Number(price).toFixed(2)}
                            </span>
                            <span className="text-xl font-bold text-slate-700">
                                ${Number(specialPrice).toFixed(2)}
                            </span>
                        </div>
                    ) : (
                        <span className="text-xl font-bold text-slate-700">
                            {" "}
                        </span>
                    )}

                    <button
                        disabled={!isAvailable || btnLoader}
                        onClick={() => { }}
                        className={`bg-blue-500 ${isAvailable
                            ? "opacity-100 hover:bg-blue-600 cursor-pointer"
                            : "opacity-70"
                            } text-white py-2 px-2 text-sm rounded-md flex items-center justify-center transition-colors duration-300`}
                    >
                        <FaShoppingCart className="mr-2" />
                        {isAvailable ? "Add to Cart" : "Stock Out"}
                    </button>

                </div>
                <ProductViewModal
                    open={openProductViewModal}
                    setOpen={setOpenProductViewModal}
                    product={selectedViewProduct}
                    isAvailable={isAvailable}
                />
            </div>
        </div>
    )
}

export default ProductCard