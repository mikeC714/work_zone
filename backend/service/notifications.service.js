import db from "../config/postgresql.config.js";

class Notis {
    constructor(db) {
        this.db = db
    }
    async getNotis(user, customerInfo, quotes){
        try{
            const notis = [];
            const now = new Date();
            const daysSinceSent = (now - new Date(qt.createdAt)) / (1000 * 60 * 60 * 24)

            quotes.forEach(qt => {
                if(qt.status === "approved"){
                    notis.push({
                        type: "Approved",
                        message: `Quote for ${customerInfo.first_name}, ${customerInfo.last_name} has been approved.`,
                        customerId: customerInfo.id,
                        quoteId: qt.id,
                        read: false
                    })
                }

                if((qt.status === "pending") && daysSinceSent > 7){
                    notifications.push({
                        type: "Follow up",
                        message: `Quote for ${customerInfo.first_name} hasn't accepted thier quote in ${Math.floor(daysSinceSent)} days.`,
                        customerId: customerInfo.id,
                        quoteId: qt.id,
                        read: false
                    })
                }

                if((qt.status === "approved") && daysSinceSent > 7){
                    notifications.push({
                        type: "Unpaid",
                        message: `Quote ${qt.id} for ${customerInfo.first_name} hasn't paid their quote in ${Math.floor(daysSinceSent)}. Consider reaching out.`,
                        customerId: customerInfo.id,
                        quoteId: qt.id,
                        read: false
                    })
                }
            })

            return {
                notifications
            }
        }catch(err){
            throw new Error(`Failed to fetch notis: ${err.message}`);
        }
    }
}

export default new Notis(db);