import React from 'react'

export const Card = ({title, subtitle, action, icon}) => {
    return (
        <div className="bg-white rounded-lg shadow-md">
            <div className="p-4 flex items-center justify-between">
                <div className="flex items-center">
                    {icon}
                    <div>
                        <h2 className="text-lg font-medium text-gray-900">{title}</h2>
                        <p className="text-sm text-gray-500">{subtitle}</p>
                    </div>
                </div>
                <button onClick={action} className="text-blue-500 hover:text-blue-700">Ver mas</button>
            </div>
        </div>
    )
}
