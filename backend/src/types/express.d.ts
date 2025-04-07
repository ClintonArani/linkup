import { User } from '../interfaces/user.interface'; // Adjust path as needed

declare global {
  namespace Express {
    interface Request {
      user?: User; // Or use a more specific type if you have one
    }
  }
}