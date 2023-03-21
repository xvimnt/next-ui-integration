
export function Modal(props) {
    const { showModal, setShowModal, children } = props
    if (!showModal) return null;

    return (
        <>
            <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex items-center justify-center">
                {/* remove icon */}
                <div className="bg-white p-2 rounded-2xl w-150 h-100">
                    <button className="cursor-pointer text-gray-500 hover:text-red-500 text-3xl" onClick={() => setShowModal(false)} >
                        x
                    </button>
                    {children}
                </div>
            </div>
        </>
    )
}