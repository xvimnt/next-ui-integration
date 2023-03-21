import React from 'react'

export const Card = ({title, subtitle, action, icon}) => {
    return (
        <div class="bg-white rounded-lg shadow-md">
            <div class="p-4 flex items-center justify-between">
                <div class="flex items-center">
                    {icon}
                    <div>
                        <h2 class="text-lg font-medium text-gray-900">{title}</h2>
                        <p class="text-sm text-gray-500">{subtitle}</p>
                    </div>
                </div>
                <button onClick={action} class="text-blue-500 hover:text-blue-700">Ver mas</button>
            </div>
        </div>
    )
}
