import React from 'react'
import { useRouteError } from 'react-router-dom'

function ErrorPage() {
    let routingError = useRouteError();
    return (
        <div className='text-center m-5 bg-red-600 p-5 rounded-md'>
            <h1 className='text-amber-400'>{routingError.status}-{routingError.data}</h1>
        </div>
    )
}

export default ErrorPage