const Like = require('../Like');

describe('a Like entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      threadId: 'thread-123',
      // commentId: 'comment-123',
      userId: 'user-123',
    };

    // Action and Assert
    expect(() => new Like(payload)).toThrowError(
      'LIKE.NOT_CONTAIN_NEEDED_PROPERTY',
    );
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      threadId: 123,
      commentId: ['comment-123'],
      userId: 'user-123',
    };

    // Action and Assert
    expect(() => new Like(payload)).toThrowError(
      'LIKE.NOT_MEET_DATA_TYPE_SPECIFICATION',
    );
  });

  it('should create Like object correctly', () => {
    // Arrange
    const payload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      userId: 'user-123',
    };

    // Action
    const { threadId, commentId, userId } = new Like(payload);

    // Assert
    expect(threadId).toEqual(payload.threadId);
    expect(commentId).toEqual(payload.commentId);
    expect(userId).toEqual(payload.userId);
  });
});
