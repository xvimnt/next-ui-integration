import React, { useState, useEffect } from 'react'
import { Modal } from '../Modal'
import { Toast } from 'src/components/Toast'
import { useRouter } from 'next/router'
// services
import { shareAccounts, getSharedAccounts, deleteSharedAccounts } from 'src/services/org'

// store
import { useAppSelector } from 'src/app/hooks'
import { selectAccounts } from 'src/app/slices/accountsSlice'

export const ShareModal = ({ showModal, setShowModal }) => {
    const [showToast, setShowToast] = useState(false)
    const [showErrorToast, setShowErrorToast] = useState(false)
    const [items, setItems] = useState([])
    const router = useRouter()

    const handleSubmit = async () => {
        // get checked values and send them to the backend
        const checkedItems = items.filter((item) => item.completed);
        const checkedItemsIds = checkedItems.map((item) => {
            return {
                account_id: item.id,
                app_id: router.query.app_id,
                eloqua_id: router.query.user_id,
            }
        });
        const res = await shareAccounts(checkedItemsIds);

        // delete unchecked accounts
        const uncheckedItems = items.filter((item) => !item.completed);
        const uncheckedItemsIds = uncheckedItems.map((item) => item.id);
        const res2 = await deleteSharedAccounts(uncheckedItemsIds);

        if (res && res2) {
            setShowToast(true);
            setTimeout(() => {
                setShowToast(false);
                setShowModal(false);
            }, 3000);
        } else {
            setShowErrorToast(true);
            setTimeout(() => {
                setShowErrorToast(false);
                setShowModal(false);
            }, 3000);
        }
    }


    // state
    const accounts = useAppSelector(selectAccounts).data;

    const handleCheckboxChange = (id) => {
        const updatedItems = items.map((item) =>
            item.id === id ? { ...item, completed: !item.completed } : item
        );
        setItems(updatedItems);
    };

    // fill items with accounts
    useEffect(() => {
        const hydrate = async () => {
            const newItems = accounts.map((account) => {
                return {
                    id: account.id,
                    name: account.name,
                    completed: false,
                };
            });
            // Get shared accounts
            const sharedAccounts = await getSharedAccounts(router.query.app_id);
            // mark shared accounts as completed
            sharedAccounts?.forEach((sharedAccount) => {
                const index = newItems.findIndex((item) => item.id === sharedAccount.account_id);
                if(index !== -1) {
                    newItems[index].completed = true;
                }
            });
            setItems(newItems);
        }
        hydrate();
    }, [accounts]);

    return (
        <Modal showModal={showModal} setShowModal={setShowModal}>
            <div className='container mx-auto'>
                <Toast body={'Completado con exito!'} show={showToast} color='bg-green-500' />
                <Toast body={'Lo sentimos, ha ocurrido un error...'} show={showErrorToast} color='bg-red-500' />
                <div className='grid grid-rows'>
                    <div className='flex justify-center items-center p-4'>
                        <div className='bg-white rounded-2xl'>
                            <h1 className='font-bold text-2xl p-1 m-2 text-center'>Configuracion</h1>
                            <div className='flex flex-col gap-4 justify-items-center p-4 w-full'>
                                <div className="mb-4">
                                    <label className="block text-gray-700 font-bold mb-2" htmlFor="email">
                                        Cuentas
                                    </label>
                                    {/* accounts checklist */}
                                    <div className="flex flex-col space-y-2">
                                        {items.map((item) => (
                                            <div key={item.id} className="flex items-center space-x-2">
                                                <input
                                                    type="checkbox"
                                                    checked={item.completed}
                                                    onChange={() => handleCheckboxChange(item.id)}
                                                    className="rounded-md border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                                />
                                                <span
                                                    className={`text-xl`}
                                                >
                                                    {item.name}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <hr className="my-3" />
                                    <div className='flex flex-col gap-2'>
                                        <button onClick={handleSubmit} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-xl focus:outline-none focus:shadow-outline" type="button">
                                            Compartir
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </Modal>
    )
}
