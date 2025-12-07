import { Description, Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { RxCross1 } from 'react-icons/rx';

function Modal({ open, setOpen, children, title = "" }) {
    return (
        <>
            <Dialog open={open} onClose={() => setOpen(false)} className="relative z-10">
                <DialogBackdrop className="fixed inset-0 bg-gray-500/75 transition-opacity duration-500 ease-in-out data-closed:opacity-0" />

                <div className="fixed inset-0">
                    <div className='absolute inset-0'>
                        <div className='pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10'>
                            <DialogPanel transition
                                className='pointer-events-auto relative w-screen max-w-[800px] transform transition duration-500 ease-in-out data-closed:translate-x-full sm:duration-700'>
                                <div className='flex h-full flex-col bg-white shadow-xl overflow-y-auto'>
                                    <div className='px-4 sm:px-6 sticky top-0 bg-white z-20 border-b border-slate-200 pb-4'>
                                        <div className='flex justify-between items-center pt-4'>
                                            <h1 className='font-montserrat font-bold text-slate-800 text-2xl'>{title}</h1>
                                            <button onClick={() => setOpen(false)} type="button">
                                                <RxCross1 className='text-slate-800 text-2xl hover:text-slate-600' />
                                            </button>
                                        </div>
                                    </div>

                                    <div className='relative flex-1 p-8'>
                                        {children}
                                    </div>
                                </div>
                            </DialogPanel>
                        </div>
                    </div>
                </div>
            </Dialog>
        </>
    )
}


export default Modal;