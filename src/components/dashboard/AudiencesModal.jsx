import React, { useState } from 'react'
import { Accounts } from 'src/components/Accounts'
import { Audiences } from 'src/components/Audiences'
import { Modal } from '../Modal'

export const AudiencesModal = ({ showModal, setShowModal }) => {
    const [selectedAccount, setSelectedAccount] = useState()
    return (
        <Modal showModal={showModal} setShowModal={setShowModal}>
            <div className='container mx-auto h-[85vh] w-full overflow-y-auto'>
                <Accounts selectedOption={selectedAccount} setSelectedOption={setSelectedAccount} />
                <Audiences selectedAccount={selectedAccount} />
            </div>
        </Modal>
    )
}
