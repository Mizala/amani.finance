import { analyzeStatement } from '../../src/controllers/statementController';
import { User } from '../../src/models/userModel';

// Mock Mongoose
jest.mock('../../src/models/userModel', () => ({
  User: {
    findById: jest.fn(),
  },
}));

describe('statementController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('analyzeStatement', () => {
    it('should validate a statement for a premium user', async () => {
      const req = { body: { userId: '1', statement: 'This is a very long statement...' } };
      const res = { json: jest.fn() };

      (User.findById as jest.Mock).mockResolvedValue({ isPremium: true });

      await analyzeStatement(req, res);

      expect(User.findById).toHaveBeenCalledWith('1');
      expect(res.json).toHaveBeenCalledWith({ message: 'Statement validated', type: 'multi-prompt', chunks: ['This is a', 'very long', 'statement...'] });
    });

    // Write similar tests for non-premium users and short statements
  });
});
