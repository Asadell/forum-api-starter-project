const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const DeleteReplyUseCase = require('../DeleteReplyUseCase');

describe('DeleteReplyUseCase', () => {
  it('should orchestrating the delete comment action correctly', async () => {
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      replyId: 'reply-123',
      userId: 'user-123',
    };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    mockThreadRepository.validateId = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.validateId = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.validateReplyId = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.validateCommentOwner = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.deleteReply = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    const deleteReplyUseCase = new DeleteReplyUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    await deleteReplyUseCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.validateId).toBeCalledWith(
      useCasePayload.threadId
    );
    expect(mockCommentRepository.validateId).toBeCalledWith(
      useCasePayload.commentId
    );
    expect(mockCommentRepository.validateReplyId).toBeCalledWith(
      useCasePayload.replyId
    );
    expect(mockCommentRepository.validateCommentOwner).toBeCalledWith(
      useCasePayload.replyId,
      useCasePayload.userId
    );
    expect(mockCommentRepository.deleteReply).toBeCalledWith(
      useCasePayload.replyId
    );
  });
});
