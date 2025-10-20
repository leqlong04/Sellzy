import { useState } from "react";
import { useForm } from "react-hook-form";
import { MdOutlineLogin } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom"
import InputField from "../shared/InputField";

const Login = () => {

    const navigate = useNavigate();
    const [loader, setLoader] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        mode: "onTouched",
    });

    const loginHandler = async (data) => {
        console.log("Login CLick");
    };


    return (
        <div className="min-h[calc(100vh-64px)] flex justify-center items-center">
            <form
                onSubmit={handleSubmit}
                className="sm:w-[450px] w-[360px] shadow-2xs py-8 sm:px-8 px-4 rounded-md">
                <div className="flex flex-col items-center justify-center space-y-4">
                    <MdOutlineLogin className="text-slate-800 text-5xl" />
                    <h1 className="text-slate-800 text-center lg:text-3xl text-2xl font-bold">
                        Login Here
                    </h1>
                </div>
                <hr className="mt-2 mb-5 text-black" />

                <div>
                    <InputField
                        label="Username"
                        required
                        id="username"
                        type="text"
                        message="*Username is required"
                        placeholder="Enter your username"
                        register={register}
                        errors={errors}
                    />

                    <InputField
                        label="Password"
                        required
                        id="password"
                        type="password"
                        message="*Password is required"
                        placeholder="Enter your password"
                        register={register}
                        errors={errors}
                    />

                </div>

                <button
                    onClick={loginHandler}
                    disabled={loader}
                    className="bg-blend-color flex gap-2 items-center justify-center font-semibold text-white w-full py-2 hover:text-slate-400 transition-colors duration-100 rounded-sm my-3"
                    type="submit"
                >
                    {loader ? (
                        <>Loading...</>
                    ) : (
                        <>Login</>
                    )}
                    Login
                </button>

                <p className="text-center text-sm text-slate-700 mt-6">
                    Don't have an account
                    <Link
                        className="font-semibold underline hover:text-black"
                        to="/register">
                        <span> SignUp</span>
                    </Link>
                </p>

            </form>

        </div>
    )
}
export default Login;