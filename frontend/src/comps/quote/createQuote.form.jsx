import { useState } from 'react';

export function CreateQuoteForm({ handleCustomerForm, handleMaterialForm, handleLaborForm}) {
    const [ matInputCount, setMatInputCount ] = useState(0);
    const [ laborInputCount, setLaborInputCount ] = useState(0);

    function handleAddMaterialInputs(){
        setMatInputCount(prev => prev + 1);
    }
    function handleAddLaborInputCount(){
        setLaborInputCount(prev => prev + 1);
    }


    return(
        <div>
            <div>

                <form onSubmit={handleCustomerForm}>
                    <input name='name' type="text" />
                    <input name='email' type="text" />
                    <input name='phone' type="text" />
                    <input name='address' type="text" />
                    <button type='submit' >Add</button>
                </form>

                <div>
                    <header>
                        <label htmlFor='materialFormContainer'>MATERIAL</label>
                        <button onClick={handleAddMaterialInputs}>+ Add</button>
                    </header>
                    <div className='materialFormContainer'>
                        <div className='materialFormContainerHeader'>
                            <div className='materialFormHeaderLeft'>
                                <p>Description</p>
                            </div>
                            <div className='materialFormHeaderRight'>
                                <p>Qty</p>
                                <p>Unit Cost</p>
                                <p>Total</p>
                            </div>
                        </div>
                        {[...matInputCount].map( _, index  => 
                            <form key={index} 
                            onSubmit={handleMaterialForm }>
                                <input name='description' type="text" />
                                <input name='quantity' type="text" />
                                <input name='unitCost' type="text" />
                            </form>
                        )}
                    </div>
                </div>

                <div>
                    <header>
                        <label htmlFor='laborContainer'>LABOR</label>
                        <button onClick={handleAddLaborInputCount}>+ Add</button>
                    </header>
                    <div className='laborContainer'>
                        <div className='laborContainerHeader'>
                            <div className='laborHeaderLeft'>
                                <p>Description</p>
                            </div>
                            <div className='laborHeaderRight'>
                                <p>Hrs</p>
                                <p>Rate</p>
                                <p>Total</p>
                            </div>
                        </div>
                        {[...laborInputCount].map(_, index => 
                            <form key={index} 
                            onSubmit={handleLaborForm}>
                                <input name='description' type="text" />
                                <input name='hours' type="text" />
                                <input name='hourlyRate' type="text" />
                            </form>
                        )}
                    </div>
                </div>

            </div>
        </div>
    )

}
