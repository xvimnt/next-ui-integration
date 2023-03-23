
export const Toast = ({ body, show }) => {
    return (
        <div className={`p-4 bg-red-500 text-white text-xl font-semibold flex items-center justify-center rounded-md shadow-md fixed top-5 left-5 min-w-[200px] min-h-[100px] ${show ? '' : 'hidden'}`}>
            {body}
        </div>
    )
}
