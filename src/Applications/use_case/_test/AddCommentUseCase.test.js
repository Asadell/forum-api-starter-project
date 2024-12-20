const CommentRepository = require('../../../Domains/comments/CommentRepository');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddCommentUseCase = require('../AddCommentUseCase');

describe('AddCommentUseCase', () => {
  it('should orchestrating the add thread action correctly', async () => {
    const useCasePayload = {
      content: 'content',
      threadId: 'thread-123',
      userId: 'user-123',
    };

    const mockAddedComment = new AddedComment({
      id: 'comment-123',
      content: useCasePayload.content,
      owner: useCasePayload.userId,
    });

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    mockThreadRepository.validateId = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.addComment = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockAddedComment));

    const getCommentUseCase = new AddCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    const addedComment = await getCommentUseCase.execute(useCasePayload);

    // Assert
    expect(addedComment).toStrictEqual(
      new AddedComment({
        id: 'comment-123',
        content: useCasePayload.content,
        owner: useCasePayload.userId,
      })
    );
  });
});
