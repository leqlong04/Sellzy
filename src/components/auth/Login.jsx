import { useState } from "react";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { MdOutlineLogin } from "react-icons/md";
import { FaSpinner } from "react-icons/fa";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import InputField from "../shared/InputField";
import { authenticateSignInUser } from "../../store/actions";

const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [loader, setLoader] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        mode: "onTouched",
    });

    const loginHandler = async (data) => {
        dispatch(authenticateSignInUser(data, toast, reset, navigate, setLoader));
    };

    return (
        <div className="min-h-[calc(100vh-64px)] flex justify-center items-center px-4 py-8 bg-gradient-to-br from-slate-50 to-slate-100">
            <form
                onSubmit={handleSubmit(loginHandler)}
                className="sm:w-[450px] w-full max-w-md bg-white shadow-xl py-8 sm:px-8 px-6 rounded-lg border border-slate-200"
            >
                <div className="flex flex-col items-center justify-center space-y-3 mb-6">
                    <div className="bg-blue-100 p-4 rounded-full">
                        <MdOutlineLogin className="text-blue-600 text-5xl" />
                    </div>
                    <h1 className="text-slate-800 text-center lg:text-3xl text-2xl font-bold">
                        Welcome Back
                    </h1>
                    <p className="text-slate-500 text-sm text-center">
                        Sign in to your account to continue
                    </p>
                </div>

                <div className="space-y-4">
                    <InputField
                        label="Username"
                        required
                        id="username"
                        type="text"
                        message="Username is required"
                        placeholder="Enter your username"
                        register={register}
                        errors={errors}
                    />

                    <div className="relative">
                        <InputField
                            label="Password"
                            required
                            id="password"
                            type={showPassword ? "text" : "password"}
                            message="Password is required"
                            placeholder="Enter your password"
                            register={register}
                            errors={errors}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-[38px] text-slate-500 hover:text-slate-700"
                        >
                            {showPassword ? (
                                <AiOutlineEyeInvisible size={20} />
                            ) : (
                                <AiOutlineEye size={20} />
                            )}
                        </button>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-slate-600">Remember me</span>
                        </label>
                        <Link
                            to="/forgot-password"
                            className="text-blue-600 hover:text-blue-700 font-medium"
                        >
                            Forgot password?
                        </Link>
                    </div>
                </div>

                <button
                    disabled={loader}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed flex gap-2 items-center justify-center font-semibold text-white w-full py-3 transition-all duration-200 rounded-lg my-6 shadow-md hover:shadow-lg"
                    type="submit"
                >
                    {loader ? (
                        <>
                            <FaSpinner className="animate-spin" />
                            <span>Signing in...</span>
                        </>
                    ) : (
                        <>
                            <MdOutlineLogin size={20} />
                            <span>Sign In</span>
                        </>
                    )}
                </button>

                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-slate-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-4 bg-white text-slate-500">
                            Or continue with
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <button
                        type="button"
                        className="flex items-center justify-center gap-2 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path
                                fill="#4285F4"
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            />
                            <path
                                fill="#34A853"
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            />
                            <path
                                fill="#FBBC05"
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            />
                            <path
                                fill="#EA4335"
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            />
                        </svg>
                        <span className="text-sm font-medium text-slate-700">Google</span>
                    </button>
                    <button
                        type="button"
                        className="flex items-center justify-center gap-2 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                    >
                        <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                        </svg>
                        <span className="text-sm font-medium text-slate-700">Facebook</span>
                    </button>
                </div>

                <p className="text-center text-sm text-slate-600 mt-6">
                    Don't have an account?{" "}
                    <Link
                        className="font-semibold text-blue-600 hover:text-blue-700 hover:underline"
                        to="/register"
                    >
                        Sign Up
                    </Link>
                </p>
            </form>
        </div>
    );
};

export default Login;