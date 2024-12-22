const GetThread = require('../GetThread');

describe('a GetThread entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'thread-abc',
      title: 'title',
      // body: 'body',
      date: '2021-08-08T07:19:09.775Z',
      username: 'asadel',
    };

    // Action and Assert
    expect(() => new GetThread(payload)).toThrowError(
      'GET_THREAD.NOT_CONTAIN_NEEDED_PROPERTY'
    );
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 'thread-abc',
      title: ['title'],
      body: 123,
      date: '2021-08-08T07:19:09.775Z',
      username: 'asadel',
    };

    // Action and Assert
    expect(() => new GetThread(payload)).toThrowError(
      'GET_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION'
    );
  });

  it('should contain correct property and value', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'body',
      body: 'body',
      date: '2021-08-08T07:19:09.775Z',
      username: 'asadel',
    };
    const expected = {
      id: 'thread-123',
      title: 'body',
      body: 'body',
      date: '2021-08-08T07:19:09.775Z',
      username: 'asadel',
    };

    // Action
    const getThread = new GetThread(payload);

    // Action and Assert
    expect(getThread).toStrictEqual(new GetThread(expected));
  });
});
