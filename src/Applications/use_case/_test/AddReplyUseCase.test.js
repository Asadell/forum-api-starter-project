const CommentRepository = require('../../../Domains/comments/CommentRepository');
const AddedReply = require('../../../Domains/comments/entities/AddedReply');
const AddReply = require('../../../Domains/comments/entities/AddReply');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddReplyUseCase = require('../AddReplyUseCase');

const replyId = 'reply-123';
const threadId = 'thread-123';
const commentId = 'comment-123';

describe('AddReplyUseCase', () => {
  it('should orchestrating the add reply action correctly', async () => {
    // Arrange
    const useCasePayload = {
      content: 'content',
      threadId,
      commentId,
      userId: 'user-123',
    };

    const mockAddedReply = new AddedReply({
      id: replyId,
      content: useCasePayload.content,
      owner: useCasePayload.userId,
    });

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    /** mocking needed function */
    mockThreadRepository.validateId = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.validateId = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.addReply = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockAddedReply));

    const getReplyUseCase = new AddReplyUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    const addedReply = await getReplyUseCase.execute(useCasePayload);

    // Assert
    expect(addedReply).toStrictEqual(
      new AddedReply({
        id: replyId,
        content: useCasePayload.content,
        owner: useCasePayload.userId,
      }),
    );
    expect(mockThreadRepository.validateId).toBeCalledWith(threadId);
    expect(mockCommentRepository.validateId).toBeCalledWith(commentId);
    expect(mockCommentRepository.addReply).toBeCalledWith(
      new AddReply({
        content: 'content',
        threadId,
        commentId,
        userId: 'user-123',
      }),
    );
  });
});
