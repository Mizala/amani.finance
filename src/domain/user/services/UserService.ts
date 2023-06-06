// src/domain/user/services/UserService.ts
import User from '../models/User';

class UserService {
  async getUserByEmail(email: string) {
    return User.findOne({ email });
  }

  async createUserByEmail(email: string) {
    const user = new User({ email });

    // Save the user to the database.
    await user.save();

    return user;
  }

  async updateUserRecords(email: string, records: object) {
    return User.findOneAndUpdate(
      { email },
      { $push: { records } },
      { new: true, upsert: true }
    );
  }
}

export default new UserService();
