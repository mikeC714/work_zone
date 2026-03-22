import { useMutation } from '@tanstack/react-query';
import { apiFetch } from '../../utils/apiFetch.jsx';
import { useState } from 'react';
import { CreateQuoteForm } from '../comps/quote/createQuote.form.jsx';
import { CqNavBar } from '../comps/navBar.jsx'
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

    function handleMaterialForm(e, index) {
        const { name, value} = e.target
            setMaterials((prevMaterials) => 
                prevMaterials.map((mats, i) => {
                    if(i === index){
                    const updated = { ...mats, [name]: value }
                        return { ...updated, total: Number(updated.unitCost) * Number(updated.quantity) }
                    }
                    return mats
                }
            )
        )
    }

  function handleLaborForm(e, index) {
        const { name, value } = e.target
            setLabor((prevLabor) =>
                prevLabor.map((lab, i) =>{
                    if(i === index){
                        const updated = { ...lab, [name]: value }
                        return { ...updated, total: Number(updated.hours) * Number(updated.hourlyRate) }
                    }
                    return lab
                }
            )
        )
    }

    const subTotal = [
        ...materials.map(mats => mats.total),
        ...labor.map(lab => lab.total),
    ].reduce((sum, val) => sum += val, 0);

    console.log(subTotal);

    const total = subTotal * ( 1 + userMarkup / 100)


    function handleAddMaterialInputs() {
        setMaterials(prev => [...prev, { description: "", quantity: 0, unitCost: 0, total: 0 }])
    }

    function handleAddLaborInputs() {
        setLabor(prev => [...prev, { description: "", hours: 0, hourlyRate: 0, total: 0 }])
    }


    return (
        <div className='createQuotePage'>
            <CqNavBar 
                handleSaveQuote={handleSaveQuote}
            />
            <div className='createQuoteContent'>

                <div className='cqLeft'>
                    <CreateQuoteForm
                        handleCustomerForm={handleCustomerForm}
                        handleLaborForm={handleLaborForm}
                        handleMaterialForm={handleMaterialForm}
                        customerInfo={customerInfo}
                        labor={labor}
                        materials={materials}
                        materialInputs={handleAddMaterialInputs}
                        laborInputs={handleAddLaborInputs}

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
                                onChange={(e) => setUserMarkup(e.target.value)}
                            />
                            <span className='cqMarkupPct'>%</span>
                            <span className='cqSummaryValue'>${(userMarkup / 100 * subTotal).toFixed(2)}</span>
                        </div>
                    </div>

                    <div className='cqTotalRow'>
                        <span className='cqTotalLabel'>Total</span>
                        <span className='cqTotalValue'>${total.toFixed(2)}</span>
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
