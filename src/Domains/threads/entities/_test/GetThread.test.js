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
});
