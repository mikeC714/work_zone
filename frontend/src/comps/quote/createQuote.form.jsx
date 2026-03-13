import { useState } from 'react';

export function CreateQuoteForm({ handleCustomerForm, handleMaterialForm, handleLaborForm, customerInfo, labor, laborTotal, materials, materialTotal}) {
    const [ materialInputCount, setMaterialInputCount ] = useState(0);
    const [ laborInputCount, setLaborInputCount ] = useState(0);

    function handleAddMaterialInputs(){
        setMaterialInputCount(prev => prev + 1);
    }
    function handleAddLaborInputCount(){
        setLaborInputCount(prev => prev + 1);
    }


    const laborInputFields = Array.from({length: laborInputCount}, (val, index) => index + 1 )
    const materialInputFields = Array.from({length: materialInputCount}, (val, matIndex) => matIndex + 1)

    return(
        <div className='cqFormWrapper'>

            <form className='cqCustomerCard'>
                <p className='cqCardLabel'>CUSTOMER</p>
                <div className='cqCustomerFields'>
                    <input className='cqInput cqInputWide' value={customerInfo.name} onChange={handleCustomerForm} name='name' type="text" placeholder='Full name' />
                    <input className='cqInput' value={customerInfo.email} onChange={handleCustomerForm} name='email' type="text" placeholder='Email' />
                    <input className='cqInput' value={customerInfo.phone} onChange={handleCustomerForm} name='phone' type="text" placeholder='Phone' />
                    <input className='cqInput cqInputWide' value={customerInfo.address} onChange={handleCustomerForm} name='address' type="text" placeholder='Address' />
                </div>
            </form>

            <div className='cqSection'>
                <div className='cqSectionHeader'>
                    <span className='cqSectionLabel'>MATERIALS</span>
                    <button className='cqAddBtn' onClick={handleAddMaterialInputs}>+ Add</button>
                </div>
                <div className='cqTable'>
                    <div className='cqTableHeader'>
                        <span className='cqColDesc'>Description</span>
                        <span className='cqColSmall'>Qty</span>
                        <span className='cqColSmall'>Unit $</span>
                        <span className='cqColSmall'>Total</span>
                    </div>
                    {[...materialInputFields].map(index =>
                        <form key={index} className='cqTableRow'>
                            <input className='cqInput cqColDesc' value={materials.description} onChange={handleMaterialForm} name='description' type="text" placeholder='Description' />
                            <input className='cqInput cqColSmall' value={materials.quantity} onChange={handleMaterialForm} name='quantity' type="number" placeholder='0' />
                            <input className='cqInput cqColSmall' value={materials.unitCost} onChange={handleMaterialForm} name='unitCost' type="number" placeholder='0' />
                            <p>{materialTotal}</p>
                        </form>
                    )}
                </div>
            </div>

            <div className='cqSection'>
                <div className='cqSectionHeader'>
                    <span className='cqSectionLabel'>LABOR</span>
                    <button className='cqAddBtn' onClick={handleAddLaborInputCount}>+ Add</button>
                </div>
                <div className='cqTable'>
                    <div className='cqTableHeader'>
                        <span className='cqColDesc'>Description</span>
                        <span className='cqColSmall'>Hrs</span>
                        <span className='cqColSmall'>Rate/hr</span>
                        <span className='cqColSmall'>Total</span>
                    </div>
                    {[...laborInputFields].map(index =>
                        <form key={index} className='cqTableRow'>
                            <input className='cqInput cqColDesc' value={labor.description} onChange={handleLaborForm} name='description' type="text" placeholder='Description' />
                            <input className='cqInput cqColSmall' value={labor.hours} onChange={handleLaborForm} name='hours' type="number" />
                            <input className='cqInput cqColSmall' value={labor.hourlyRate} onChange={handleLaborForm} name='hourlyRate' type="number"/>
                            <p>{laborTotal}</p>
                        </form>
                    )}
                </div>
            </div>

        </div>
    )

}
