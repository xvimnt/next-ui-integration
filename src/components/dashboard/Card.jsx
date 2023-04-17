import React from 'react'

export const Card = ({ svg, title, description, action }) => {
    return (
        <div className="p-4 md:w-1/3 flex">
            <div className="w-12 h-12 inline-flex items-center justify-center rounded-full bg-indigo-100 text-indigo-500 mb-4 flex-shrink-0">
                {svg}
            </div>
            <div className="flex-grow pl-6">
                <h2 className="text-gray-900 text-lg title-font font-medium mb-2">{title}</h2>
                <p className="leading-relaxed text-base">{description}</p>
                <button onClick={action} className="mt-3 text-indigo-500 inline-flex items-center">Empieza
                    <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-4 h-4 ml-2" viewBox="0 0 24 24">
                        <path d="M5 12h14M12 5l7 7-7 7"></path>
                    </svg>
                </button>
            </div>
        </div>
    )
}
