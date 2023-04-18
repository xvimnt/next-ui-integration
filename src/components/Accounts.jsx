import { AccountsSelect } from './AccountsSelect'

// store
import { useStore } from '../app/store'

export const Accounts = ({ selectedOption, setSelectedOption }) => {

    // state
    const [accounts] = useStore(
        (state) => [state.accounts]
    )

    function handleSelectChange(event) {
        const selected = accounts.filter(acc => acc.id === event.target.value)[0]
        setSelectedOption(selected);
    }

    return (
        <>
            <hr className='my-3' />
            <h1 className='text-3xl font-bold flex flex-col items-center my-4'>Cuentas Publicitarias</h1>
            <div className="flex flex-col items-center justify-center">
                <AccountsSelect selectedOption={selectedOption?.id} handleSelectChange={handleSelectChange} accounts={accounts} />
            </div>
        </>
    )
}
