const AddComment = require('../AddComment');

describe('a AddComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      content: 'abc',
      userId: 'user-123',
    };

    // Action and Assert
    expect(() => new AddComment(payload)).toThrowError(
      'ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY'
    );
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      content: 123,
      userId: 'user-123',
      threadId: true,
    };

    // Action and Assert
    expect(() => new AddComment(payload)).toThrowError(
      'ADD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION'
    );
  });

  it('should create AddComment object correctly', () => {
    // Arrange
    const payload = {
      content: 'dicoding',
      threadId: 'thread-V1StGXR8_Z5jdHi6B-myT',
      userId: 'user-V1StGXR8_Z5jdHi6B-myT',
    };

    // Action
    const { content, threadId, userId } = new AddComment(payload);

    // Assert
    expect(content).toEqual(payload.content);
    expect(threadId).toEqual(payload.threadId);
    expect(userId).toEqual(payload.userId);
  });
});
