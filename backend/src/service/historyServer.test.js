// userService.test.js
const userService = require('./historyService');
const db = require('../models');

// Mock the db models used in the service
jest.mock('../models');

describe('historyService', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mocks before each test
  });

  describe('findLike', () => {
    it('should return the found like record if exists', async () => {
      const mockResult = { id: 1, type: 'like', visitor: 1, visited: 2 };
      db.history.findOne.mockResolvedValue(mockResult);

      const result = await userService.findLike(1, 2);
      expect(result).toEqual(mockResult);
      expect(db.history.findOne).toHaveBeenCalledWith({
        where: { type: 'like', visitor: 1, visited: 2 }
      });
    });

    it('should return null if no like record found', async () => {
      db.history.findOne.mockResolvedValue(null);

      const result = await userService.findLike(1, 2);
      expect(result).toBeNull();
      expect(db.history.findOne).toHaveBeenCalledWith({
        where: { type: 'like', visitor: 1, visited: 2 }
      });
    });
  });

  describe('getVisitsHistory', () => {
    it('should return visits history of a user', async () => {
      const mockVisits = [
        { id: 1, visitedUser: { id: 2, username: 'user2', profile: { url: 'image.png' } } }
      ];
      db.history.findAll.mockResolvedValue(mockVisits);

      const result = await userService.getVisitsHistory(1);
      expect(result).toEqual(mockVisits);
      expect(db.history.findAll).toHaveBeenCalledWith({
        where: { type: 'view', visitor: 1 },
        attributes: [],
        include: [
          {
            model: db.users,
            as: 'visitedUser',
            attributes: ['id', 'username', 'firstname', 'lastname', 'gender', 'age', 'fame', 'city', 'country'],
            include: [
              {
                model: db.images,
                as: 'profile',
                attributes: ['url'],
                where: { profile: true },
                required: false
              }
            ]
          }
        ],
        group: ['db.history.visited']
      });
    });
  });

  describe('like', () => {
    it('should create a new like record', async () => {
      const mockLike = { id: 1, type: 'like', visitor: 1, visited: 2 };
      db.history.create.mockResolvedValue(mockLike);

      const result = await userService.like(1, 2);
      expect(result).toEqual(mockLike);
      expect(db.history.create).toHaveBeenCalledWith({
        type: 'like',
        visitor: 1,
        visited: 2
      });
    });
  });

  describe('unlike', () => {
    it('should delete a like record', async () => {
      db.history.destroy.mockResolvedValue(1); // 1 row deleted

      const result = await userService.unlike(1, 2);
      expect(result).toBe(1); // Expect the result to be the number of deleted rows
      expect(db.history.destroy).toHaveBeenCalledWith({
        where: { type: 'like', visitor: 1, visited: 2 }
      });
    });
  });

  describe('getCountViews', () => {
    it('should return the count of distinct views', async () => {
      db.history.count.mockResolvedValue(5);

      const result = await userService.getCountViews(1);
      expect(result).toBe(5);
      expect(db.history.count).toHaveBeenCalledWith({
        distinct: true,
        col: 'visitor',
        where: { type: 'view', visited: 1 }
      });
    });
  });

  describe('getUserFollowers', () => {
    it('should return the list of followers for a user', async () => {
      const mockFollowers = [
        { id: 1, visitorUser: { id: 2, username: 'follower1', profile: { url: 'image.png' } } }
      ];
      db.history.findAll.mockResolvedValue(mockFollowers);

      const result = await userService.getUserFollowers(1);
      expect(result).toEqual(mockFollowers);
      expect(db.history.findAll).toHaveBeenCalledWith({
        where: { type: 'like', visited: 1 },
        include: [
          {
            model: db.users,
            as: 'visitorUser',
            attributes: ['id', 'firstname', 'lastname', 'username', 'gender', 'city', 'country', 'age', 'fame'],
            include: [
              {
                model: db.images,
                as: 'profile',
                attributes: ['url'],
                where: { profile: true },
                required: false
              }
            ]
          }
        ],
        distinct: true
      });
    });
  });
});
