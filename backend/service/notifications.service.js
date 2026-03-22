export class Notis {
    constructor(supabase) {
        this.supabase = supabase
    }
    async getNotis(user){
        const { data: quotes, error } = await this.supabase
            .from('quotes')
            .select('id, customer_id, status, createdAt')
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
                    customerId: qt.customer_id,
                    quoteId: qt.id
                })
            }

            const daysSinceSent = (now - new Date(qt.createdAt)) / (1000 * 60 * 60 * 24)

            if ((qt.status == 'pending' || qt.status == 'sent') && daysSinceSent > 7) {
                notifications.push({
                    type: 'Follow up',
                    customerId: qt.customer_id,
                    quoteId: qt.id
                })
            }

            if (qt.status == 'approved' && quotes.status == 'unpaid') {
                notifications.push({
                    type: 'Unpaid',
                    customerId: qt.customer_id,
                    quoteId: qt.id
                })
            }
        })

        return notifications
    }
}