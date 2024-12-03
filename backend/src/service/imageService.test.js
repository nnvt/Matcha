// Import necessary modules
const { Image, User } = require('..//models'); // Adjust the path to your Sequelize models
const {
  find,
  findOne,
  findUserImages,
  findProfileImage,
  findPicture,
  save,
  deleteProfilePicture,
  del,
} = require('./imageService'); // Adjust the path to your service functions

// Mock the Sequelize models
jest.mock('../models', () => ({
  Image: {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    destroy: jest.fn(),
  },
  User: jest.fn(),
}));

describe('Image Service Functions', () => {
  afterEach(() => {
    // Clear mock calls and instances between tests
    jest.clearAllMocks();
  });

  describe('find', () => {
    it('should find all images based on the given where condition', async () => {
      const mockImages = [{ id: 1, url: 'image1.jpg' }, { id: 2, url: 'image2.jpg' }];
      Image.findAll.mockResolvedValue(mockImages);

      const whereCondition = { user_id: 1 };
      const result = await find(whereCondition);

      expect(Image.findAll).toHaveBeenCalledTimes(1);
      expect(Image.findAll).toHaveBeenCalledWith({ where: whereCondition });
      expect(result).toEqual(JSON.stringify(mockImages));
    });

    it('should throw an error if findAll fails', async () => {
      const error = new Error('Failed to find images');
      Image.findAll.mockRejectedValue(error);

      await expect(find({ user_id: 1 })).rejects.toThrow('Failed to find images');
    });
  });

  describe('findOne', () => {
    it('should find one image based on id and user_id', async () => {
      const mockImage = { id: 1, url: 'image1.jpg', user_id: 1 };
      Image.findOne.mockResolvedValue(mockImage);

      const result = await findOne(1, 1);

      expect(Image.findOne).toHaveBeenCalledTimes(1);
      expect(Image.findOne).toHaveBeenCalledWith({ where: { id: 1, user_id: 1 } });
      expect(result).toEqual(mockImage);
    });

    it('should return null if no image is found', async () => {
      Image.findOne.mockResolvedValue(null);

      const result = await findOne(1, 1);

      expect(Image.findOne).toHaveBeenCalledTimes(1);
      expect(result).toBeNull();
    });

    it('should throw an error if findOne fails', async () => {
      const error = new Error('Failed to find image');
      Image.findOne.mockRejectedValue(error);

      await expect(findOne(1, 1)).rejects.toThrow('Failed to find image');
    });
  });

  describe('findUserImages', () => {
    it('should find all images for a specific user', async () => {
      const mockImages = [{ id: 1, url: 'image1.jpg' }, { id: 2, url: 'image2.jpg' }];
      Image.findAll.mockResolvedValue(mockImages);

      const result = await findUserImages(1);

      expect(Image.findAll).toHaveBeenCalledTimes(1);
      expect(Image.findAll).toHaveBeenCalledWith({
        include: [{ model: User, as: 'user', where: { id: 1 }, attributes: [] }],
      });
      expect(result).toEqual(JSON.stringify(mockImages));
    });

    it('should throw an error if findUserImages fails', async () => {
      const error = new Error('Failed to find user images');
      Image.findAll.mockRejectedValue(error);

      await expect(findUserImages(1)).rejects.toThrow('Failed to find user images');
    });
  });

  describe('findProfileImage', () => {
    it('should find the profile image of a specific user', async () => {
      const mockImage = { id: 1, url: 'profile.jpg', profile: 1 };
      Image.findOne.mockResolvedValue(mockImage);

      const result = await findProfileImage(1);

      expect(Image.findOne).toHaveBeenCalledTimes(1);
      expect(Image.findOne).toHaveBeenCalledWith({ where: { user_id: 1, profile: 1 }, include: [{ model: User, as: 'user', attributes: [] }] });
      expect(result).toEqual(mockImage);
    });

    it('should return null if no profile image is found', async () => {
      Image.findOne.mockResolvedValue(null);

      const result = await findProfileImage(1);

      expect(Image.findOne).toHaveBeenCalledTimes(1);
      expect(result).toBeNull();
    });
  });

  describe('findPicture', () => {
    it('should find a specific picture based on user_id and url', async () => {
      const mockImage = { id: 1, url: 'image.jpg', profile: 0 };
      Image.findOne.mockResolvedValue(mockImage);

      const result = await findPicture(1, 'image.jpg');

      expect(Image.findOne).toHaveBeenCalledTimes(1);
      expect(Image.findOne).toHaveBeenCalledWith({ where: { profile: 0, user_id: 1, url: 'image.jpg' } });
      expect(result).toEqual(mockImage);
    });
  });

  describe('save', () => {
    it('should save a new image and return the profile image if the saved image is a profile picture', async () => {
      const mockImage = { id: 1, url: 'profile.jpg', profile: 1, user_id: 1 };
      Image.create.mockResolvedValue(mockImage);
      Image.findOne.mockResolvedValue(mockImage); // Mock findProfileImage to return the profile picture

      const result = await save(mockImage);

      expect(Image.create).toHaveBeenCalledTimes(1);
      expect(Image.create).toHaveBeenCalledWith(mockImage);
      expect(result).toEqual(mockImage); // Since it's a profile image, findProfileImage will be called and return the same mockImage
    });

    it('should save a new image and return the picture if the saved image is not a profile picture', async () => {
      const mockImage = { id: 2, url: 'image.jpg', profile: 0, user_id: 1 };
      Image.create.mockResolvedValue(mockImage);
      Image.findOne.mockResolvedValue(mockImage); // Mock findPicture to return the picture

      const result = await save(mockImage);

      expect(Image.create).toHaveBeenCalledTimes(1);
      expect(Image.create).toHaveBeenCalledWith(mockImage);
      expect(result).toEqual(mockImage); // Since it's not a profile image, findPicture will be called and return the same mockImage
    });
  });

  describe('deleteProfilePicture', () => {
    it('should delete a profile picture by image ID and user ID', async () => {
      Image.destroy.mockResolvedValue(1); // Assume 1 row affected

      const result = await deleteProfilePicture(1, 1);

      expect(Image.destroy).toHaveBeenCalledTimes(1);
      expect(Image.destroy).toHaveBeenCalledWith({ where: { id: 1, user_id: 1 } });
      expect(result).toBeUndefined(); // Function does not return anything
    });
  });

  describe('del', () => {
    it('should delete an image by image ID, user ID, and profile status', async () => {
      Image.destroy.mockResolvedValue(1); // Assume 1 row affected

      const result = await del(1, 1, 0);

      expect(Image.destroy).toHaveBeenCalledTimes(1);
      expect(Image.destroy).toHaveBeenCalledWith({ where: { id: 1, user_id: 1, profile: 0 } });
      expect(result).toBeUndefined(); // Function does not return anything
    });
  });
});
