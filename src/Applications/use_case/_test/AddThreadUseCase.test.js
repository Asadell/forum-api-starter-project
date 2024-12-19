const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const AddThread = require('../../../Domains/threads/entities/AddThread');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddThreadUseCase = require('../AddThreadUseCase');

describe('AddThreadUseCase', () => {
  it('should orchestrating the add user action correctly', async () => {
    const useCasePayload = {
      title: 'dicoding',
      body: 'Dicoding Indonesia',
      userId: 'user-V1StGXR8_Z5jdHi6B-myT',
    };

    const mockAddedThread = new AddedThread({
      id: 'thread-V1StGXR8_Z5jdHi6B-myT',
      title: useCasePayload.title,
      owner: useCasePayload.userId,
    });

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();

    /** mocking needed function */
    mockThreadRepository.addThread = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockAddedThread));

    /** creating use case instance */
    const getThreadUseCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action
    const addedThread = await getThreadUseCase.execute(useCasePayload);

    // Assert
    expect(addedThread).toStrictEqual(
      new AddedThread({
        id: 'thread-V1StGXR8_Z5jdHi6B-myT',
        title: useCasePayload.title,
        owner: useCasePayload.userId,
      })
    );

    expect(mockThreadRepository.addThread).toBeCalledWith(
      new AddThread({
        title: useCasePayload.title,
        body: 'Dicoding Indonesia',
        userId: useCasePayload.userId,
      })
    );
  });
});
