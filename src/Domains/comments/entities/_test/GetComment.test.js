const GetComment = require('../GetComment');

describe('a GetComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      username: 'asadel',
      date: '2021-08-08T07:19:09.775Z',
      // content: 'content',
    };

    // Action and Assert
    expect(() => new GetComment(payload)).toThrowError(
      'GET_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY'
    );
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      username: 123,
      date: '2021-08-08T07:19:09.775Z',
      content: ['content'],
    };

    // Action and Assert
    expect(() => new GetComment(payload)).toThrowError(
      'GET_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION'
    );
  });
});
