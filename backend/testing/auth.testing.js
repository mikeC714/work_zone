import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert';
import db from "../config/postgresql.config.js"; // ✅ your existing connection
import TokenService from "../service/db/token.service.js";
import { decrypt } from '../utils/encrypt.js';

const userId = "070f2f6c-6d3f-485a-9b32-fa63fc5291b3"

const t = TokenService.getRefreshToken(userId);
const token = t.rows;
console.log(token)

// describe('TokenService', () => {

//     it("deletes a user's token", async () => {
        
//         const result = await TokenService.deleteRefreshToken( userId, token);

//         assert.strictEqual(result, true);

//         const { rows } = await db.query(
//             'SELECT * FROM tokens WHERE token = $1 AND user_id = $2', [token, userId]
//         );
//         assert.strictEqual(rows.length, 0);
//     });

//     it('returns false if token does not exist', async () => {
//         const result = await TokenService.deleteRefreshToken(userId, token);
//         assert.strictEqual(result, false);
//     });

// });