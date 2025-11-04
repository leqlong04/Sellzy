import React, { useEffect } from 'react'
import InputField from '../shared/InputField'
import { useForm } from 'react-hook-form';
import { FaAddressCard, FaSpinner } from 'react-icons/fa';
import { useDispatch, useSelector } from "react-redux"
import { MdOutlineLogin } from 'react-icons/md';
import toast from 'react-hot-toast';
import { addUpdateUserAddress } from '../../store/actions';
const AddAddressForm = ({ address, setOpenAddressModal }) => {

    const dispatch = useDispatch();
    const { btnLoader } = useSelector((state) => state.errors);
    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors },
    } = useForm({
        mode: "onTouched",
    });

    const onSaveAddressHandler = async (data) => {
        dispatch(addUpdateUserAddress(
            data,
            toast,
            address?.addressId,
            setOpenAddressModal
        ));
    };

    useEffect(() => {
        if (address?.addressId) {
            setValue("buildingName", address?.buildingName);
            setValue("city", address?.city);
            setValue("street", address?.street);
            setValue("state", address?.state);
            setValue("pincode", address?.pincode);
            setValue("country", address?.country);


        }
    }, [address]);

    return (
        <div className="">
            <form
                onSubmit={handleSubmit(onSaveAddressHandler)}
                className=""
            >
                <div className="flex justify-center items-center mb-4 font-semibold text-2xl text-slate-800 py-2 px-4">
                    <FaAddressCard className="mr-2 text-2xl" />
                    {!address?.addressId ?
                        "Add address" :
                        "Update address"}
                </div>

                <div className="flex flex-col gap-4">
                    <InputField
                        label="Building Name"
                        required
                        id="buildingName"
                        type="text"
                        message="Building name is required"
                        placeholder="Enter your building name"
                        register={register}
                        errors={errors}
                    />
                    <InputField
                        label="City"
                        required
                        id="city"
                        message="City is required"
                        placeholder="Enter city"
                        register={register}
                        errors={errors}
                    />
                    <InputField
                        label="State"
                        required
                        id="state"
                        message="State is required"
                        placeholder="Enter state"
                        register={register}
                        errors={errors}
                    />

                    <InputField
                        label="Pincode"
                        required
                        id="pincode"
                        message="Pincode is required"
                        placeholder="Enter Pincode"
                        register={register}
                        errors={errors}
                    />

                    <InputField
                        label="Street"
                        required
                        id="street"
                        message="Street is required"
                        placeholder="Enter Street"
                        register={register}
                        errors={errors}
                    />

                    <InputField
                        label="Country"
                        required
                        id="country"
                        message="Country is required"
                        placeholder="Enter Country"
                        register={register}
                        errors={errors}
                    />
                </div>

                <button
                    disabled={btnLoader}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed flex gap-2 items-center justify-center font-semibold text-white w-full py-3 transition-all duration-200 rounded-lg my-6 shadow-md hover:shadow-lg"
                    type="submit"
                >
                    {btnLoader ? (
                        <>
                            <FaSpinner className="animate-spin" />
                            <span>Loading...</span>
                        </>
                    ) : (
                        <>

                            <span>Save</span>
                        </>
                    )}
                </button>


            </form>
        </div>
    )
}

export default AddAddressForm