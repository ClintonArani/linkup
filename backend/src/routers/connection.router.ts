// connection.router.ts
import express from 'express';
import { ConnectionController } from '../controllers/connectiom.controller';

const router = express.Router();
const connectionController = new ConnectionController();


router.post('/send-request', connectionController.sendRequest);
router.put('/update-status/:connectionId', connectionController.updateConnectionStatus);
router.get('/user-connections/:userId', connectionController.getUserConnections);
router.get('/pending-requests/:userId', connectionController.getPendingRequests);
router.get('/:connectionId', connectionController.getConnectionById);
router.delete('/:connectionId', connectionController.deleteConnection);

// Get all connections (admin only)
router.get('/', connectionController.getAllConnections);

export default router;