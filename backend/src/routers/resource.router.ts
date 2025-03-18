import { Router } from 'express';
import { ResourceController } from '../controllers/resource.controller';

const controller = new ResourceController();
const resource_router = Router();

resource_router.post('/add', controller.addResource);
resource_router.put('/edit/:resource_id', controller.editResource);
resource_router.delete('/delete/:resource_id', controller.deleteResource);
resource_router.post('/borrow', controller.borrowBook);
resource_router.get('/borrowed-books', controller.getBorrowedBooks);
resource_router.get('/overdue-books', controller.getOverdueBooks);
resource_router.get('/view/:resource_id', controller.viewResource);
resource_router.get('/all', controller.getAllResources);
resource_router.get('/single/:resource_id', controller.getResourceById)
resource_router.post('/return', controller.returnBook);
resource_router.get('/borrowed-by-user/:user_id', controller.getBooksBorrowedByUser);
resource_router.get('/overdue-by-user/:user_id', controller.getOverdueBooksByUser);

export default resource_router;