import { User } from './users.dto';

export class UserHelper {
  static fromFirestore(data): Partial<User> {
    return {
      id: data.id,
      firstname: data.firstname,
      isAdmin: data.is_admin,
      lastname: data.lastname,
      email: data.email,
      phone: data.phone,
      balance: data.balance,
    };
  }
}
