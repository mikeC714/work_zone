import { useState, useRef } from 'react';
import { useEmailHook } from '../hooks/email.hooks.jsx';
import { useCreateQuote } from "../hooks/createQuote.hook.jsx";
import { CreateQuoteForm } from '../comps/createQuote.form.jsx';
import { CqNavBar } from '../comps/navBar.jsx'
import { Send, Loader, Check } from 'lucide-react';

export function CreateQuote(){
    const {mutate, isPending, isError, isSuccess} = useCreateQuote();
    const {mutate:sendEmail, isSendingEmail, isEmailErr, emailSent} = useEmailHook();
    const idRef = useRef(0);
    const [userMarkup, setUserMarkup] = useState("");
    const [materials, setMaterials] = useState([
        {
            description: "",
            quantity: "",
            unitCost: "",
            total: 0
        }
    ]);
    const [labor, setLabor] = useState([
        {
            description: "",
            hours: "",
            hourlyRate: "",
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
    const [status, setStatus] = useState('DRAFT');
   

    function handleStatusChange(e){
        setStatus(e.target.value);
    }


    async function handleSendQuote() {
		for(const [_, val] of Object.entries(customerInfo)){
			if(!val.trim()) throw new Error("Missing Customer Input. Please fill all input fields.");
		}
		// if(!materials.description.trim() || !materials.quantity.trim() || !materials.unitCost.trim()) throw new Error("Missing Field. Please fill all input fields.");
		// if(!labor.description.trim() || !labor.hours.trim() || !labor.hourlyRate.trim()) throw new Error("Missing Feild. Please fill all input fields.");

        mutate({
            customer: customerInfo,
            quote: { status: status, markup: Number(userMarkup), total: Number(total.toFixed(2)) },
            labor: labor.map(l => ({
                ...l,
                hours: Number(l.hours),
                hourlyRate: Number(l.hourlyRate)
            })),
            materials: materials.map(m => ({
                ...m,
                quantity: Number(m.quantity),
                unitCost: Number(m.unitCost)
            }))
        }, {
            onSuccess: (data) => {
                sendEmail({
                    id: data.id,
                    token: data.token,
                    customer: customerInfo,
                    quote: { markup: Number(userMarkup), total: Number(total.toFixed(2)) },
                    labor: labor.map(l => ({ ...l, hours: Number(l.hours), hourlyRate: Number(l.hourlyRate) })),
                    materials: materials.map(m => ({ ...m, quantity: Number(m.quantity), unitCost: Number(m.unitCost) }))
                });
            }
        });
    }


    function handleSaveQuote() {
      mutate({
        customer: customerInfo,
        quote: { status: status ,markup: Number(userMarkup), total: Number(total.toFixed(2)) },
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
        const { name, value } = e.target;
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
        setMaterials(prev => 
            [...prev, { 
                id: idRef.current++ ,
                description: "", 
                quantity: "", 
                unitCost: "", 
                total: 0 
            }])
    }

    function handleAddLaborInputs() {
        setLabor(prev => 
            [...prev, {
                id: idRef.current++, 
                description: "", 
                hours: "", 
                hourlyRate: "", 
                total: 0 
            }])
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

    const markUpDiff = limitNum(markUpPerc, 10)
    return (
        <div className='createQuotePage'>
            {isSendingEmail && (
                <div className='overlay'>
                    // <Loader className='cqLoader'/>
				<div className='cqCheckContainer'>
					<Check className='cqCheck'/> 
				</div>		

                </div>
            )}
            {emailSent && (
                <div className='overlay'>
                	<div className='cqSuccessContainer'> 

						<p className='sendQuoteSuccess'>Quote Sent!</p>
               		</div>
				</div>
            )}
            {isEmailErr && (
                <div className='overlay'>
                    <p>Failed to send quote.</p>
                </div>
            )}

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
                                placeholder='0'
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
                        onClick={() => {
                            handleSendQuote()
                        }}>
                        SEND TO CUSTOMER <Send size={14} />
                    </button>
                </div>

            </div>
        </div>
    )
}


