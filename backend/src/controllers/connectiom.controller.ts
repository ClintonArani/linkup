// connection.controller.ts
import { Request, Response } from 'express';
import { ConnectionService } from '../services/connection.service';

const connectionService = new ConnectionService();

export class ConnectionController {
    // Send a connection request
    async sendRequest(req: Request, res: Response) {
        const { senderId, receiverId } = req.body;
        try {
            const connection = await connectionService.sendRequest({ senderId, receiverId });
            res.status(201).json(connection);
        } catch (error) {
            res.status(500).json({ message: 'Failed to send connection request' });
        }
    }

    // Accept or reject a connection request
    async updateConnectionStatus(req: Request, res: Response) {
        const { connectionId } = req.params;
        const { status } = req.body;
        try {
            const connection = await connectionService.updateConnectionStatus({ connectionId, status });
            res.status(200).json(connection);
        } catch (error) {
            res.status(500).json({ message: 'Failed to update connection status' });
        }
    }

    // Get all connections for a user
    async getUserConnections(req: Request, res: Response) {
        const { userId } = req.params;
        try {
            const connections = await connectionService.getUserConnections(userId);
            res.status(200).json(connections);
        } catch (error) {
            res.status(500).json({ message: 'Failed to fetch user connections' });
        }
    }

    // Get pending connection requests for a user
    async getPendingRequests(req: Request, res: Response) {
        const { userId } = req.params;
        try {
            const requests = await connectionService.getPendingRequests(userId);
            res.status(200).json(requests);
        } catch (error) {
            res.status(500).json({ message: 'Failed to fetch pending requests' });
        }
    }

    // Get a specific connection by ID
    async getConnectionById(req: Request, res: Response) {
        const { connectionId } = req.params;
        try {
            const connection = await connectionService.getConnectionById(connectionId);
            res.status(200).json(connection);
        } catch (error) {
            res.status(500).json({ message: 'Failed to fetch connection' });
        }
    }

    // Delete a connection
    async deleteConnection(req: Request, res: Response) {
        const { connectionId } = req.params;
        try {
            await connectionService.deleteConnection(connectionId);
            res.status(200).json({ message: 'Connection deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Failed to delete connection' });
        }
    }

    // Get all connections (admin only)
    async getAllConnections(req: Request, res: Response) {
        try {
            const connections = await connectionService.getAllConnections();
            res.status(200).json(connections);
        } catch (error) {
            res.status(500).json({ message: 'Failed to fetch all connections' });
        }
    }
}