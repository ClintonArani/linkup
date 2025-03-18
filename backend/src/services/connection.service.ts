import { Connection, ConnectionRequest, ConnectionStatusUpdate } from '../interfaces/user.interface';
import mssql from 'mssql';
import { sqlConfig } from '../config/sqlConfig';
import { v4 } from 'uuid';

export class ConnectionService {
    // Send a connection request
    async sendRequest(request: ConnectionRequest): Promise<Connection> {
        const { senderId, receiverId } = request;
        const connectionId = v4();
        const createdAt = new Date();

        let pool = await mssql.connect(sqlConfig);

        if (pool.connected) {
            const query = `
                INSERT INTO connections (id, senderId, receiverId, status, createdAt)
                VALUES (@connectionId, @senderId, @receiverId, 'pending', @createdAt)
            `;
            await pool.request()
                .input('connectionId', mssql.VarChar, connectionId)
                .input('senderId', mssql.VarChar, senderId)
                .input('receiverId', mssql.VarChar, receiverId)
                .input('createdAt', mssql.DateTime, createdAt)
                .query(query);

            return this.getConnection(senderId, receiverId);
        } else {
            throw new Error("Unable to establish database connection");
        }
    }

    // Accept or reject a connection request
    async updateConnectionStatus(update: ConnectionStatusUpdate): Promise<Connection> {
        const { connectionId, status } = update;
        const updatedAt = new Date();

        let pool = await mssql.connect(sqlConfig);

        if (pool.connected) {
            const query = `
                UPDATE connections
                SET status = @status, updatedAt = @updatedAt
                WHERE id = @connectionId
            `;
            await pool.request()
                .input('connectionId', mssql.VarChar, connectionId)
                .input('status', mssql.VarChar, status)
                .input('updatedAt', mssql.DateTime, updatedAt)
                .query(query);

            return this.getConnectionById(connectionId);
        } else {
            throw new Error("Unable to establish database connection");
        }
    }

    // Get a connection by ID
    async getConnectionById(connectionId: string): Promise<Connection> {
        let pool = await mssql.connect(sqlConfig);

        if (pool.connected) {
            const query = `
                SELECT * FROM connections WHERE id = @connectionId
            `;
            const result = await pool.request()
                .input('connectionId', mssql.VarChar, connectionId)
                .query(query);

            return result.recordset[0];
        } else {
            throw new Error("Unable to establish database connection");
        }
    }

    // Get a connection between two users
    async getConnection(senderId: string, receiverId: string): Promise<Connection> {
        let pool = await mssql.connect(sqlConfig);

        if (pool.connected) {
            const query = `
                SELECT * FROM connections
                WHERE (senderId = @senderId AND receiverId = @receiverId)
                OR (senderId = @receiverId AND receiverId = @senderId)
            `;
            const result = await pool.request()
                .input('senderId', mssql.VarChar, senderId)
                .input('receiverId', mssql.VarChar, receiverId)
                .query(query);

            return result.recordset[0];
        } else {
            throw new Error("Unable to establish database connection");
        }
    }

    // Get all connections for a user
    async getUserConnections(userId: string): Promise<Connection[]> {
        let pool = await mssql.connect(sqlConfig);

        if (pool.connected) {
            const query = `
                SELECT * FROM connections
                WHERE (senderId = @userId OR receiverId = @userId)
                AND status = 'accepted'
            `;
            const result = await pool.request()
                .input('userId', mssql.VarChar, userId)
                .query(query);

            return result.recordset;
        } else {
            throw new Error("Unable to establish database connection");
        }
    }

    // Get pending connection requests for a user
    async getPendingRequests(userId: string): Promise<Connection[]> {
        let pool = await mssql.connect(sqlConfig);

        if (pool.connected) {
            const query = `
                SELECT * FROM connections
                WHERE receiverId = @userId AND status = 'pending'
            `;
            const result = await pool.request()
                .input('userId', mssql.VarChar, userId)
                .query(query);

            return result.recordset;
        } else {
            throw new Error("Unable to establish database connection");
        }
    }

    // Delete a connection
    async deleteConnection(connectionId: string): Promise<void> {
        let pool = await mssql.connect(sqlConfig);

        if (pool.connected) {
            const query = `
                DELETE FROM connections WHERE id = @connectionId
            `;
            await pool.request()
                .input('connectionId', mssql.VarChar, connectionId)
                .query(query);
        } else {
            throw new Error("Unable to establish database connection");
        }
    }

    // Get all connections (admin only)
    async getAllConnections(): Promise<Connection[]> {
        let pool = await mssql.connect(sqlConfig);

        if (pool.connected) {
            const query = `
                SELECT * FROM connections
            `;
            const result = await pool.request().query(query);

            return result.recordset;
        } else {
            throw new Error("Unable to establish database connection");
        }
    }
}