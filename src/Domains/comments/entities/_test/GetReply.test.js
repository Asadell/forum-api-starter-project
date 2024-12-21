const GetReply = require('../GetReply');

describe('a GetReply entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      // content: 'content',
      date: '2021-08-08T07:19:09.775Z',
      username: 'asadel',
    };

    // Action and Assert
    expect(() => new GetReply(payload)).toThrowError(
      'GET_REPLY.NOT_CONTAIN_NEEDED_PROPERTY'
    );
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      content: 123,
      date: '2021-08-08T07:19:09.775Z',
      username: 'asadel',
    };

    // Action and Assert
    expect(() => new GetReply(payload)).toThrowError(
      'GET_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION'
    );
  });
});
