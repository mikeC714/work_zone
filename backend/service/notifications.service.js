export class Notis {
    constructor(supabase) {
        this.supabase = supabase
    }
    async getNotis(user, customerInfo){

        const { data: quotes, error } = await this.supabase
            .from('quotes')
            .select('id, customer_id, status, created_at')
            .eq('user_id', user.id)

        if (error) {
            throw new Error(error.message)
        }

        const notifications = []
        const now = new Date()

        quotes.forEach(qt => {
            if (qt.status == 'approved') {
                notifications.push({
                    type: 'Approved',
                    message: `Quote for ${customerInfo.first_name} ${customerInfo.last_name} has been approved`,
                    customerId: customerInfo.id,
                    quoteId: qt.id,
                    read: false
                })
            }

            const daysSinceSent = (now - new Date(qt.createdAt)) / (1000 * 60 * 60 * 24)

            if ((qt.status == 'pending' || qt.status == 'sent') && daysSinceSent > 7) {
                notifications.push({
                    type: 'Follow up',
                    message: `Quote for ${customerInfo.first_name} ${customerInfo.last_name} hasn't been accepted in ${Math.floor(daysSinceSent)} days`,
                    customerId: customerInfo.id,
                    quoteId: qt.id,
                    read: false
                })
            }

            if (qt.status == 'approved' && qt.status == 'unpaid') {  // ADD QUOTE PAID STATUS TO MAKE THINGS SIMPLE
                notifications.push({
                    type: 'Unpaid',
                    message: `Quote for ${customerInfo.first_name} ${customerInfo.last_name} is unpaid`,
                    customerId: customerInfo.id,
                    quoteId: qt.id,
                    read: false
                })
            }
        })

        return notifications
    }
}