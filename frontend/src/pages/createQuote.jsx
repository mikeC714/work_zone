import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { apiFetch } from '../../utils/apiFetch.jsx';
import { useCreateQuote } from "../hooks/createQuote.hook.jsx";
import { sendQuote } from "../hooks/email.hooks.jsx";
import { CreateQuoteForm } from '../comps/createQuote.form.jsx';
import { CqNavBar } from '../comps/navBar.jsx'
import { Send } from 'lucide-react';

export function CreateQuote(){
    const {mutate, isPending, isError, error, isSuccess} = useCreateQuote();
    const [userMarkup, setUserMarkup] = useState(0);
    const [materials, setMaterials] = useState([
        {
            id: crypto.randomUUID(),
            description: "",
            quantity: 0,
            unitCost: 0,
            metrics: 0,
            total: 0
        }
    ]);
    const [labor, setLabor] = useState([
        {
            id: crypto.randomUUID(),
            description: "",
            hours: 0,
            hourlyRate: 0,
            total: 0
        }
    ]);
    const [customerInfo, setCustomerInfo] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        address: "",
    });

    const [status, setStatus] = useState('Draft');

    function handleStatusChange(e){
        setStatus(e.target.value);
    }

    function handleSaveQuote() {
      mutate({
        customer: customerInfo,
        quote: {status: status ,markup: Number(userMarkup), total: Number(total.toFixed(2)) },
        labor: labor.map(l => ({
            ...l,
            hours: Number(l.hours),
            hourlyRate: Number(l.hourlyRate)
        })),
        materials: materials.map(m => ({
            ...m,
            quantity: Number(m.quantity),
            unitCost: Number(m.unitCost)
        })),
      })
        if(isSuccess){ 
            return(
                <div className="cqPageOverlay">
                    <p className="cqSuccessMsg">Successfully Created Quote.</p>
                </div>
            )
        } 
    }

  function handleCustomerForm(e) {
    const { name, value } = e.target
    setCustomerInfo(prev => ({
        ...prev,
        [name]: value
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

    const total = subTotal * ( 1 + userMarkup / 100)


    function handleAddMaterialInputs() {
        setMaterials(prev => [...prev, { id: crypto.randomUUID(), description: "", quantity: 0, unitCost: 0, total: 0 }])
    }

    function handleAddLaborInputs() {
        setLabor(prev => [...prev, { id: crypto.randomUUID(), description: "", hours: 0, hourlyRate: 0, total: 0 }])
    }

    function limitNum(val, limit){
        if(val.length > limit){
            return  val.substring(0, limit-3) + '...';
        }
        return val;
    }

    function removeLaborBtn(id){
        setLabor(labor.filter(inputs => inputs.id !== id));
    }

    function removeMatBtn(id){
        setMaterials(materials.filter(inputs => inputs.id !== id));
    }
    
    const markUpPerc = (userMarkup / 100 * subTotal).toLocaleString();

    const markUpDiff = limitNum(markUpPerc, 20)


    return (
        <div className='createQuotePage'>
            <CqNavBar 
                handleSaveQuote={handleSaveQuote}
                handleStatusChange={handleStatusChange}
                statusValue={status}
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
                        removeLaborBtn={removeLaborBtn}
                        removeMatBtn={removeMatBtn}
                    />
                </div>

                <div className='cqRight'>
                    <p className='cqSummaryTitle'>SUMMARY</p>

                    <div className='cqSummaryRow'>
                        <span className='cqSummaryLabel'>Subtotal</span>
                        <span className='cqSummaryValue'>${subTotal.toLocaleString()}</span>
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
                            <span className='cqMarkupDifference'>${markUpDiff}</span>
                        </div>
                    </div>

                    <div className='cqTotalRow'>
                        <span className='cqTotalLabel'>Total</span>
                        <span className='cqTotalValue'>${total.toFixed(2)}</span>
                    </div>

                    <button 
                        className='cqSendToCustomerBtn'
                        onClick={(e) => {
                            handleSaveQuote(),
                            sendQuote()
                        }}
                    >
                        SEND TO CUSTOMER <Send size={14} />
                    </button>
                </div>

            </div>
        </div>
    )
}


// NEEDS ON SUBMIT BUTTON THAT UTITLIZES THE MUTATION QUERY TO POST A NEW CUSTOMER
