import React from 'react'

export const Audience = ({ audience, handleClick }) => {
    const { id, name } = audience
    return (
        <div className="w-full">
            <div className="border-gray-400 rounded-2xl border-2 bg-white p-4 flex flex-col">
                <div className="mb-8">
                    <div className="text-gray-900 font-bold text-xl mb-2">{id}</div>
                    <p className="text-gray-700 text-base">{name}</p>
                </div>
                <div className="flex items-center">
                    <div className="text-sm grid grid-cols-2 gap-2">
                        <button onClick={() => handleClick(audience)} className='bg-red-500 rounded-3xl text-xl p-3'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M23 18h-2v2h-1v-2h-2v-1h2v-2h1v2h2v1zm-15.999-10c-2.493 0-4.227 2.383-1.866 6.839.774 1.464-.826 1.812-2.545 2.209-1.491.345-1.59 1.072-1.59 2.334l.002.618h1.329c0-1.918-.186-1.385 1.824-1.973 1.014-.295 1.91-.723 2.316-1.612.212-.463.355-1.22-.162-2.197-.952-1.798-1.219-3.374-.712-4.215.547-.909 2.27-.908 2.819.015.935 1.567-.793 3.982-1.02 4.982h1.396c.44-1 1.206-2.208 1.206-3.9.001-2.01-1.31-3.1-2.997-3.1zm7.754-1.556c.895-1.487 3.609-1.494 4.512.022.77 1.291.423 3.484-.949 6.017-.098.18-.17.351-.232.517h1.464c3.057-5.744.816-9-2.548-9-3.323 0-5.635 3.177-2.488 9.119 1.033 1.952-1.101 2.416-3.394 2.946-1.988.458-2.12 1.429-2.12 3.11l.003.825h1.331c0-2.069-.08-2.367 1.173-2.657 1.918-.442 3.729-.86 4.39-2.305.241-.527.401-1.397-.206-2.543-1.362-2.572-1.704-4.777-.936-6.051z" /></svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
