import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { CreateQuoteForm } from '../comps/quote/createQuote.form.jsx';
import { Send } from 'lucide-react';


export function CreateQuote(){
    
    const [userMarkup, setUserMarkup] = useState(0);
    const [materials, setMaterials] = useState([]);
    const [labor, setLabor] = useState([]);
    const [customerInfo, setCustomerInfo] = useState({});

  function handleCustomerForm(e) {
    e.preventDefault();
    const customer = Object.fromEntries(new FormData(e.target));
    setCustomerInfo({
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      address: customer.address
    });
  }

  function handleMaterialForm(e) {
    e.preventDefault();
    const mats = Object.fromEntries(new FormData(e.target));
    setMaterials(prev => [...prev,
        {
            description: mats.description,
            quantity: Number(mats.quantity),
            unitCost: Number(mats.unitCost),
            metrics: mats.metrics,
            total: mats.unitCost * mats.quantity
        }])
    e.target.reset();
  }

  function handleLaborForm(e) {
    e.preventDefault();
    const labor = Object.fromEntries(new FormData(e.target));
    setLabor(prev =>[...prev,
        {
            description: labor.description,
            hours: Number(labor.hours),
            hourlyRate: Number(labor.hourlyRate),
            total: labor.hours * labor.hourlyRate
        }])

    e.target.reset();
  }
    const subTotal = [
        ...materials.map(mats => mats.total),
        ...labor.map(lab => lab.total),
    ].reduce((sum, val) => sum += val, 0);

    const total = subTotal * ( 1 + userMarkup / 100)



    return (
        <div className='createQuotePage'>
            <nav>
                <div className="navRight">
                    <select name="selectedQuoteStatus" className='quoteStatusSelection'>
                        <option value="draft">Draft</option>
                        <option value="inProgress">In Progress</option>
                        <option value="approved">Approved</option>
                        <option value="completed">Completed</option>
                    </select>
                    <button className="saveQuoteBtn">Save Quote</button>
                </div>
            </nav>
            <div>
                <CreateQuoteForm 
                    handleCustomerForm={handleCustomerForm}
                    handleLaborForm={handleLaborForm}
                    handleMaterialForm={handleMaterialForm}
                />
            </div>
              <div className='summaryContainer'>
                <div className='subTotalContainer'>
                    <label htmlFor="subTotal">Subtotal</label>
                    <p id='subTotal'>{subTotal}</p>
                </div>

                <div className='markupContainer'>
                    <label htmlFor="markup">Markup</label>
                    <div className='markup'>
                        <input 
                        type='number'
                        value={userMarkup}
                        onChange={(e) => setUserMarkup(Number(e.target.value))}/>
                        <p id="markup">{userMarkup / 100 * subTotal}</p>
                    </div>
                </div>

                <div className='totalConatainer'>
                    <label htmlFor="total">Total</label>
                    <h3 id='total'>${total}</h3>
                </div>
                <button>SEND TO CUSTOMER <Send /></button>
            </div>
        </div>
    )
}


// NEEDS ON SUBMIT BUTTON THAT UTITLIZES THE MUTATION QUERY TO POST A NEW CUSTOMER