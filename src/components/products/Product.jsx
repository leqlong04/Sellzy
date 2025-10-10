import { FaExclamationTriangle } from "react-icons/fa";
import ProductCard from "../shared/ProductCard";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchProducts } from "../../store/actions";
import Filter from "./Filter";
import { RevolvingDot } from "react-loader-spinner";
import useProductFilter from "../../hooks/useProductFilter";
import { ClockLoader, RingLoader } from "react-spinners";
import Loader from "../shared/Loader";

const Product = () => {

    // const { isLoading, errorMessage } = useSelector((state) => state.errors);


    const isLoading = false;
    const errorMessage = "";
    // const { products } = useSelector((state) => state.product);

    // const dispatch = useDispatch();

    // useEffect(() => {
    //     dispatch(fetchProducts());
    // }, [dispatch]);
    // Sample product data
    const products = [
        {
            productId: 652,
            productName: "Iphone Xs max",
            image: "https://placehold.co/600x400",
            description: "Experience the latest in mobile technology with advanced cameras.Experience the latest in mobile technology with advanced cameras.Experience the latest in mobile technology with advanced cameras.Experience the latest in mobile technology with advanced cameras.",
            quantity: 10,
            price: 1450.0,
            discount: 10.0,
            specialPrice: 1305.0,
        },
        {
            productId: 654,
            productName: "MacBook Air M2s",
            image: "https://placehold.co/600x400",
            description: "Ultra-thin laptop with Apple's M2 chip, providing ",
            quantity: 0,
            price: 2550.0,
            discount: 20.0,
            specialPrice: 2040.0,
        }
    ];
    return (
        <div className="lg:px-10 sm:px-3 px-2 py-1 2xl:w-[105%] 2xl:mx-auto">
            <Filter />
            {isLoading ? (
                <Loader text={"Loading products..."} />

            ) : errorMessage ? (
                <div className="flex justify-center items-center h-[200px]">
                    <FaExclamationTriangle className="text-slate-800 text-3xl mr-2" />
                    <span className="text-slate-800  text-lg font-medium">{errorMessage}</span>
                </div>

            ) : (
                <div className="min-h-[700px]">
                    <div className="pb-6 pt-10 grid 2xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 gap-y-1 gap-x-5">


                        {products &&
                            products.map((item, i) => <ProductCard key={i} {...item} />)}
                    </div>
                </div>
            )

            }
        </div>
    )
}

export default Product