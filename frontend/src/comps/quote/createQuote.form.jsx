import { useState } from 'react';

export function CreateQuoteForm({ handleCustomerForm, handleMaterialForm, handleLaborForm, customerInfo, labor, materials, laborInputs, materialInputs, handleNumBlur}) {

    return(
        <div className='cqFormWrapper'>

            <form className='cqCustomerCard'>
                <p className='cqCardLabel'>CUSTOMER</p>
                <div className='cqCustomerFields'>
                    <input className='cqInput cqInputWide' value={customerInfo.name} onChange={(e) => handleCustomerForm(e, index)} name='name' type="text" placeholder='Full name' />
                    <input className='cqInput' value={customerInfo.email} onChange={(e) => handleCustomerForm(e, index)} name='email' type="text" placeholder='Email' />
                    <input className='cqInput' value={customerInfo.phone} onChange={(e) => handleCustomerForm(e, index)} name='phone' type="text" placeholder='Phone' />
                    <input className='cqInput cqInputWide' value={customerInfo.address} onChange={(e) => handleCustomerForm(e, index)} name='address' type="text" placeholder='Address' />
                </div>
            </form>

            <div className='cqSection'>
                <div className='cqSectionHeader'>
                    <span className='cqSectionLabel'>MATERIALS</span>
                    <button className='cqAddBtn' onClick={materialInputs}>+ Add</button>
                </div>
                <div className='cqTable'>
                    <div className='cqTableHeader'>
                        <span className='cqColDesc'>Description</span>
                        <span className='cqColSmall'>Qty</span>
                        <span className='cqColSmall'>Unit $</span>
                        <span className='cqColSmall'>Total</span>
                    </div>
                    {materials.map((mats, index) =>
                        <form key={index} className='cqTableRow'>
                            <input 
                                className='cqInput cqColDesc'
                                name='description' 
                                type="text" 
                                placeholder='Description'
                                value={mats.description} 
                                onChange={(e) => handleMaterialForm(e, index)}
                            />
                            <input 
                                className='cqInput cqColSmall'
                                name='quantity' 
                                type="number" placeholder='0'
                                value={mats.quantity} 
                                onChange={(e) => handleMaterialForm(e, index)} 
                            />
                            <input 
                                className='cqInput cqColSmall'
                                name='unitCost' 
                                type='number'
                                value={mats.unitCost} 
                                onChange={(e) => handleMaterialForm(e, index)} 
                            />
                            <p className='cqColSmall'>${mats.total}</p>
                        </form>
                    )}
                </div>
            </div>

            <div className='cqSection'>
                <div className='cqSectionHeader'>
                    <span className='cqSectionLabel'>LABOR</span>
                    <button className='cqAddBtn' onClick={laborInputs}>+ Add</button>
                </div>
                <div className='cqTable'>
                    <div className='cqTableHeader'>
                        <span className='cqColDesc'>Description</span>
                        <span className='cqColSmall'>Hrs</span>
                        <span className='cqColSmall'>Rate/hr</span>
                        <span className='cqColSmall'>Total</span>
                    </div>
                    {labor.map((lab,index) =>
                        <form key={index} className='cqTableRow'>
                            <input 
                                className='cqInput cqColDesc'
                                name='description' 
                                type="text" placeholder='Description'
                                value={lab.description} 
                                onChange={(e) => handleLaborForm(e, index)} 
                            />
                            <input className='cqInput cqColSmall'
                                name='hours' 
                                type="number"
                                value={lab.hours} 
                                onChange={(e) => handleLaborForm(e, index)} 
                            />
                            <input className='cqInput cqColSmall'
                                name='hourlyRate' 
                                type="number"
                                value={lab.hourlyRate} 
                                onChange={(e) => handleLaborForm(e, index)} 
                            />
                            <p className='cqColSmall'>${lab.total}</p>
                        </form>
                    )}
                </div>
            </div>

        </div>
    )

}
