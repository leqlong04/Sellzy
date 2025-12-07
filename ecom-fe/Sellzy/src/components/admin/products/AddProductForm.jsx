import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import InputField from '../../shared/InputField';
import { Button } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { addNewProductFromDashboard, fetchCategories, updateProductFromDashboard } from '../../../store/actions';
import toast from 'react-hot-toast';
import Spinners from '../../shared/Spinners';
import SelectTextField from '../../shared/SelectTextField';
import Skeleton from '../../shared/Skeleton';
import ErrorPage from '../../shared/ErrorPage';
import RichTextEditor from '../../shared/RichTextEditorSimple';

const AddProductForm = ({ setOpen, product, update = false, isOpen }) => {
    const [loader, setLoader] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState();
    const [detailDescription, setDetailDescription] = useState('');
    const [prevIsOpen, setPrevIsOpen] = useState(false);
    
    const { categories } = useSelector((state) => state.products);
    const { categoryLoader, errorMessage } = useSelector((state) => state.errors);
    const { user } = useSelector((state) => state.auth);
    const isAdmin = user && user?.roles?.includes("ROLE_ADMIN");

    const dispatch = useDispatch();
    const {
        register,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors }
    } = useForm({
        mode: "onTouched"
    });

    const handleCancel = () => {
        // Just close modal - useEffect will handle reset
        setOpen(false);
    };

    const saveProductHandler = (data) => {
        if (!update) {
            // create new product logic
            const sendData = {
                ...data,
                detailDescription: detailDescription,
                categoryId: selectedCategory.categoryId,
            };
            dispatch(addNewProductFromDashboard(
                sendData, toast, reset, setLoader, setOpen, isAdmin
            ));
        } else {
            const sendData = {
                ...data,
                detailDescription: detailDescription,
                id: product.id,
            };
            dispatch(updateProductFromDashboard(sendData, toast, reset, setLoader, setOpen, isAdmin));
        }
    };


    // Reset form when modal closes (isOpen: true -> false)
    useEffect(() => {
        if (prevIsOpen && !isOpen) {
            // Modal just closed, reset form
            reset({
                productName: '',
                price: '',
                quantity: '',
                discount: '',
                specialPrice: '',
                description: ''
            });
            setDetailDescription('');
            if (categories && categories.length > 0) {
                setSelectedCategory(categories[0]);
            }
        }
        setPrevIsOpen(isOpen);
    }, [isOpen, prevIsOpen, reset, categories]);

    // Load product data when modal opens in edit mode
    useEffect(() => {
        if (isOpen) {
            if (update && product && product.id) {
                // Modal is open and we're in edit mode, load product data
                setValue("productName", product?.productName || '');
                setValue("price", product?.price || '');
                setValue("quantity", product?.quantity || '');
                setValue("discount", product?.discount || '');
                setValue("specialPrice", product?.specialPrice || '');
                setValue("description", product?.description || '');
                setDetailDescription(product?.detailDescription || '');
            } else if (!update) {
                // Modal is open in add mode, ensure form is reset
                reset({
                    productName: '',
                    price: '',
                    quantity: '',
                    discount: '',
                    specialPrice: '',
                    description: ''
                });
                setDetailDescription('');
                if (categories && categories.length > 0) {
                    setSelectedCategory(categories[0]);
                }
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen, update, product]);


    useEffect(() => {
        if (!update) {
            dispatch(fetchCategories());
        }
    }, [dispatch, update]);

    useEffect(() => {
        if (!categoryLoader && categories) {
            setSelectedCategory(categories[0]);
        }
    }, [categories, categoryLoader]);

    // Show loading only when fetching categories for add mode
    if (!update && categoryLoader) return <Skeleton />
    if (errorMessage) return <ErrorPage message={errorMessage} />
    
    // In edit mode, wait for product data only when modal is open and product is not available
    // Don't show skeleton if modal is closed (isOpen = false)
    if (update && isOpen && product !== '' && (!product || !product.id)) {
        return <Skeleton />
    }

    return (
        <div className='py-5 relative h-full overflow-y-auto'>
            <form className='space-y-4 pb-20'
                onSubmit={handleSubmit(saveProductHandler)}>
                <div className='flex md:flex-row flex-col gap-4 w-full'>
                    <InputField
                        label="Product Name"
                        required
                        id="productName"
                        type="text"
                        message="This field is required*"
                        register={register}
                        placeholder="Product Name"
                        errors={errors}
                    />

                    {!update && (
                        <SelectTextField
                            label="Select Categories"
                            select={selectedCategory}
                            setSelect={setSelectedCategory}
                            lists={categories}
                        />
                    )}
                </div>

                <div className='flex md:flex-row flex-col gap-4 w-full'>
                    <InputField
                        label="Price"
                        required
                        id="price"
                        type="number"
                        message="This field is required*"
                        placeholder="Product Price"
                        register={register}
                        errors={errors}
                    />

                    <InputField
                        label="Quantity"
                        required
                        id="quantity"
                        type="number"
                        message="This field is required*"
                        register={register}
                        placeholder="Product Quantity"
                        errors={errors}
                    />
                </div>
                <div className="flex md:flex-row flex-col gap-4 w-full">
                    <InputField
                        label="Discount"
                        id="discount"
                        type="number"
                        message="This field is required*"
                        placeholder="Product Discount (%)"
                        register={register}
                        errors={errors}
                    />
                    <InputField
                        label="Special Price"
                        id="specialPrice"
                        type="number"
                        message="This field is required*"
                        placeholder="Product Discount"
                        register={register}
                        errors={errors}
                    />
                </div>

                {/* Tax Preview Section */}
                {watch("price") && Number(watch("price")) > 0 && (
                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-2">
                        <h4 className="font-semibold text-sm text-slate-800 mb-3">Tax Preview (7%)</h4>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="text-slate-600">Base Price:</span>
                                <span className="ml-2 font-semibold">${Number(watch("price") || 0).toFixed(2)}</span>
                            </div>
                            {watch("discount") && Number(watch("discount")) > 0 && (
                                <>
                                    <div>
                                        <span className="text-slate-600">Discount ({watch("discount")}%):</span>
                                        <span className="ml-2 font-semibold text-green-600">
                                            -${(Number(watch("price") || 0) * Number(watch("discount") || 0) / 100).toFixed(2)}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-slate-600">Special Price:</span>
                                        <span className="ml-2 font-semibold">
                                            ${(Number(watch("price") || 0) - (Number(watch("price") || 0) * Number(watch("discount") || 0) / 100)).toFixed(2)}
                                        </span>
                                    </div>
                                </>
                            )}
                            <div>
                                <span className="text-slate-600">Tax Amount (7%):</span>
                                <span className="ml-2 font-semibold text-amber-600">
                                    ${((Number(watch("price") || 0) - (Number(watch("price") || 0) * (Number(watch("discount") || 0) / 100))) * 0.07).toFixed(2)}
                                </span>
                            </div>
                            <div>
                                <span className="text-slate-600">Price After Tax:</span>
                                <span className="ml-2 font-semibold text-blue-600">
                                    ${((Number(watch("price") || 0) - (Number(watch("price") || 0) * (Number(watch("discount") || 0) / 100))) * 1.07).toFixed(2)}
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                <div className="flex flex-col gap-2 w-full">
                    <label htmlFor='desc'
                        className='font-semibold text-sm text-slate-800'>
                        Description
                    </label>

                    <textarea
                        rows={5}
                        placeholder="Add product description...."
                        className={`px-4 py-2 w-full border outline-hidden bg-transparent text-slate-800 rounded-md ${errors["description"]?.message ? "border-red-500" : "border-slate-700"
                            }`}
                        maxLength={255}
                        {...register("description", {
                            required: { value: true, message: "Description is required" },
                        })}
                    />

                    {errors["description"]?.message && (
                        <p className="text-sm font-semibold text-red-600 mt-0">
                            {errors["description"]?.message}
                        </p>
                    )}
                </div>

                <div className="flex flex-col gap-2 w-full mt-4">
                    <label htmlFor='detailDesc'
                        className='font-semibold text-sm text-slate-800'>
                        Detail Description
                        <span className="text-xs text-slate-500 ml-2 font-normal">(Rich text with images)</span>
                    </label>
                    <div className="border border-slate-300 rounded-md">
                        <RichTextEditor
                            value={detailDescription}
                            onChange={setDetailDescription}
                            placeholder="Add detailed product description with images, formatting, etc..."
                        />
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                        💡 Tip: Click the image icon in the toolbar to upload images directly into the description
                    </p>
                </div>

                <div className='flex w-full justify-between items-center sticky bottom-0 bg-white pt-4 pb-2 border-t border-slate-200 mt-6'>
                    <Button disabled={loader}
                        onClick={handleCancel}
                        variant='outlined'
                        className='text-white py-[10px] px-4 text-sm font-medium'>
                        Cancel
                    </Button>

                    <Button
                        disabled={loader}
                        type='submit'
                        variant='contained'
                        color='primary'
                        className='bg-custom-blue text-white  py-[10px] px-4 text-sm font-medium'>
                        {loader ? (
                            <div className='flex gap-2 items-center'>
                                <Spinners /> Loading...
                            </div>
                        ) : (
                            "Save"
                        )}
                    </Button>
                </div>
            </form>
        </div>
    )
}

export default AddProductForm