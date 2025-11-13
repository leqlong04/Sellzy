import { Alert, AlertTitle } from '@mui/material'
import React from 'react'

const PaypalPayment = () => {
    return (
        <div className='h-96 flex justify-center items-center'>
            <Alert severity="warning" variant='filled' style={{ maxWidth: "400px" }}>
                <AlertTitle>Paypal Unvailable</AlertTitle>
                Paypal payment is unvailable. Please use another.
            </Alert>
        </div>
    )
}

export default PaypalPayment