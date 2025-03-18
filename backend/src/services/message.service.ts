import mssql from 'mssql';
import { v4 } from 'uuid';
import { sqlConfig } from '../config/sqlConfig';

export class messageService {
    async sendMessage(sender_id: string, receiver_id: string, message: string) {
        const pool = await mssql.connect(sqlConfig);
        const message_id = v4();

        await pool.request()
            .input('id', mssql.VarChar, message_id)
            .input('sender_id', mssql.VarChar, sender_id)
            .input('receiver_id', mssql.VarChar, receiver_id)
            .input('message', mssql.Text, message)
            .execute('sendMessage');

        return { message: 'Message sent successfully' };
    }

    async getMessages(sender_id: string, receiver_id: string) {
        const pool = await mssql.connect(sqlConfig);

        const result = await pool.request()
            .input('sender_id', mssql.VarChar, sender_id)
            .input('receiver_id', mssql.VarChar, receiver_id)
            .execute('getMessages');

        return result.recordset;
    }
}