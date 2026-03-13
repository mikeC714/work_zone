import { useMutation } from '@tanstack/react-query';
import { apiFetch } from '../../utils/apiFetch.jsx';
import { useState } from 'react';
import { CreateQuoteForm } from '../comps/quote/createQuote.form.jsx';
import { Send } from 'lucide-react';


export function CreateQuote(){

    const [userMarkup, setUserMarkup] = useState(0);
    const [materials, setMaterials] = useState([
        {
            description: "",
            quantity: 0,
            unitCost: 0,
            metrics: 0,
            total: 0
        }
    ]);
    const [labor, setLabor] = useState([
        {
            description: "",
            hours: 0,
            hourlyRate: 0,
            total: 0
        }
    ]);
    const [customerInfo, setCustomerInfo] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
    });

    const { mutate, isPending, isError, error, isSuccess } = useMutation({
        mutationFn: async() => await apiFetch('http://localhost:3000/api/create-quote', POST, newQuote),
    })


    function handleSaveQuote(){
        e.preventDefault();

        mutate({
            customer: customerInfo,
            quote: userMarkup, total,
            labor,
            materials
        })
    }


  function handleCustomerForm(e) {
    const { customer, value } = e.target
    setCustomerInfo(prev => ({
        ...prev,
        [customer]: value
    }))
  }

  function handleMaterialForm(mats) {
    setMaterials(prev => [...prev,
        {
            description: mats.description,
            quantity: Number(mats.quantity),
            unitCost: Number(mats.unitCost),
            metrics: mats.metrics,
            total: mats.unitCost * mats.quantity
        }
    ])
  }

  function handleLaborForm(lab) {
    setLabor(prev =>[...prev,
        {
            description: lab.description,
            hours: Number(lab.hours),
            hourlyRate: Number(lab.hourlyRate),
            total: lab.hours * lab.hourlyRate
        }
    ])
  }

  const materialTotal = [...materials].map(mats => mats.total)
  const laborTotal = [...labor].map(lab => lab.total)

  console.log(materialTotal, laborTotal)

    const subTotal = [
        ...materials.map(mats => mats.total),
        ...labor.map(lab => lab.total),
    ].reduce((sum, val) => sum += val, 0);

    const total = subTotal * ( 1 + userMarkup / 100)



    return (
        <div className='createQuotePage'>

            <nav className='createQuoteNav'>
                <div className='cqNavLeft'>
                    <span className='cqNavBrand'>VOLT</span>
                    <span className='cqNavSep'>/</span>
                    <span className='cqNavCrumb'>Quotes</span>
                </div>
                <div className='cqNavRight'>
                    <select name="selectedQuoteStatus" className='quoteStatusSelect'>
                        <option value="draft">Draft</option>
                        <option value="inProgress">In Progress</option>
                        <option value="approved">Approved</option>
                        <option value="completed">Completed</option>
                    </select>
                    <button className='cqChangeOrderBtn'>+ Change Order</button>
                    <button className='cqSendQuoteBtn' type='submit' onClick={handleSaveQuote}>
                        Save Quote
                    </button>
                </div>
            </nav>

            <div className='createQuoteContent'>

                <div className='cqLeft'>
                    <CreateQuoteForm
                        handleCustomerForm={handleCustomerForm}
                        handleLaborForm={handleLaborForm}
                        handleMaterialForm={handleMaterialForm}
                        customerInfo={customerInfo}
                        labor={labor}
                        laborTotal={laborTotal}
                        materials={materials}
                        materialTotal={materialTotal}

                    />
                </div>

                <div className='cqRight'>
                    <p className='cqSummaryTitle'>SUMMARY</p>

                    <div className='cqSummaryRow'>
                        <span className='cqSummaryLabel'>Subtotal</span>
                        <span className='cqSummaryValue'>${subTotal}</span>
                    </div>

                    <div className='cqSummaryRow'>
                        <span className='cqSummaryLabel'>Markup</span>
                        <div className='cqMarkupRow'>
                            <input
                                className='cqMarkupInput'
                                type='number'
                                value={userMarkup}
                                onChange={(e) => setUserMarkup(Number(e.target.value))}
                            />
                            <span className='cqMarkupPct'>%</span>
                            <span className='cqSummaryValue'>${(userMarkup / 100 * subTotal)}</span>
                        </div>
                    </div>

                    <div className='cqTotalRow'>
                        <span className='cqTotalLabel'>Total</span>
                        <span className='cqTotalValue'>${total}</span>
                    </div>

                    <button className='cqSendToCustomerBtn'>
                        SEND TO CUSTOMER <Send size={14} />
                    </button>
                </div>

            </div>
        </div>
    )
}


// NEEDS ON SUBMIT BUTTON THAT UTITLIZES THE MUTATION QUERY TO POST A NEW CUSTOMER
