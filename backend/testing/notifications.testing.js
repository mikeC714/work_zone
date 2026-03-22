// notis.test.js
import { test, describe, beforeEach } from 'node:test';
import assert from 'node:assert';
import { Notis } from '../service/notifications.service.js';

// Mock supabase
const mockSupabase = {
    from() { return this },
    select() { return this },
    eq: () => {}
};

const notis = new Notis(mockSupabase);
const mockUser = { id: 'user-123' };

describe('Notis.getNotis', () => {

    test('should return approved notification', async () => {
        mockSupabase.eq = async () => ({
            data: [{ id: '1', customer_id: 'cust-1', status: 'approved', createdAt: new Date() }],
            error: null
        });

        const result = await notis.getNotis(mockUser);
        assert.ok(result.some(n => n.type === 'Approved' && n.quoteId === '1'));
    });

    test('should return follow up when pending over 7 days', async () => {
        const oldDate = new Date();
        oldDate.setDate(oldDate.getDate() - 8); // ← 8 days ago

        mockSupabase.eq = async () => ({
            data: [{ id: '2', customer_id: 'cust-2', status: 'pending', createdAt: oldDate }],
            error: null
        });

        const result = await notis.getNotis(mockUser);
        assert.ok(result.some(n => n.type === 'Follow up' && n.quoteId === '2'));
    });

    test('should NOT return follow up when pending under 7 days', async () => {
        mockSupabase.eq = async () => ({
            data: [{ id: '3', customer_id: 'cust-3', status: 'pending', createdAt: new Date() }],
            error: null
        });

        const result = await notis.getNotis(mockUser);
        assert.ok(!result.some(n => n.type === 'Follow up' && n.quoteId === '3'));
    });

    test('should return empty array when no quotes match', async () => {
        mockSupabase.eq = async () => ({
            data: [{ id: '4', customer_id: 'cust-4', status: 'draft', createdAt: new Date() }],
            error: null
        });

        const result = await notis.getNotis(mockUser);
        assert.strictEqual(result.length, 0);
    });

    test('should throw when supabase returns error', async () => {
        mockSupabase.eq = async () => ({
            data: null,
            error: { message: 'Database error' }
        });

        await assert.rejects(
            async () => await notis.getNotis(mockUser),
            { message: 'Database error' }
        );
    });
});