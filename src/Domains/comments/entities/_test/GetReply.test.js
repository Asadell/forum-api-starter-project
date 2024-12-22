const GetReply = require('../GetReply');

describe('a GetReply entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'reply-123',
      // content: 'reply content',
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
      id: 'reply-123',
      content: 123,
      date: '2021-08-08T07:19:09.775Z',
      username: 'asadel',
    };

    // Action and Assert
    expect(() => new GetReply(payload)).toThrowError(
      'GET_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION'
    );
  });

  it('should contain correct property and value', () => {
    // Arrange
    const payload = {
      id: 'reply-123',
      content: 'reply content',
      date: '2021-08-08T07:19:09.775Z',
      username: 'asadel',
      is_delete: false,
    };
    const expected = {
      id: 'reply-123',
      content: 'reply content',
      date: '2021-08-08T07:19:09.775Z',
      username: 'asadel',
    };

    // Action
    const getReply = new GetReply(payload);

    // Action and Assert
    expect(getReply).toStrictEqual(new GetReply(expected));
  });

  it('should contain correct property and value with trus is_delete', () => {
    // Arrange
    const payload = {
      id: 'reply-123',
      content: 'reply content',
      date: '2021-08-08T07:19:09.775Z',
      username: 'asadel',
    };
    const expected = {
      id: 'reply-123',
      content: 'reply content',
      date: '2021-08-08T07:19:09.775Z',
      username: 'asadel',
    };

    // Action
    const getReply = new GetReply(payload);

    // Action and Assert
    expect(getReply).toStrictEqual(new GetReply(expected));
  });
});
