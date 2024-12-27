const CommentRepository = require('../../../Domains/comments/CommentRepository');
const LikeRepository = require('../../../Domains/likes/LikeRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const LikeCommentUseCase = require('../LikeCommentUseCase');

describe('LikeCommentUseCase', () => {
  it('should orchestrating the add like action correctly', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      userId: 'user-123',
    };

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockLikeRepository = new LikeRepository();

    /** mocking needed function */
    mockThreadRepository.validateId = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.validateId = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockLikeRepository.validateLikeExist = jest
      .fn()
      .mockImplementation(() => Promise.resolve(false));
    mockLikeRepository.addLike = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    const getLikeCommentUseCase = new LikeCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      likeRepository: mockLikeRepository,
    });

    // Action
    await getLikeCommentUseCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.validateId).toBeCalledWith(
      useCasePayload.threadId
    );
    expect(mockCommentRepository.validateId).toBeCalledWith(
      useCasePayload.commentId
    );
    expect(mockLikeRepository.validateLikeExist).toBeCalledWith(useCasePayload);
    expect(mockLikeRepository.addLike).toBeCalledWith(useCasePayload);
  });
  it('should orchestrating the delete like action correctly', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      userId: 'user-123',
    };

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockLikeRepository = new LikeRepository();

    /** mocking needed function */
    mockThreadRepository.validateId = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.validateId = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockLikeRepository.validateLikeExist = jest
      .fn()
      .mockImplementation(() => Promise.resolve(true));
    mockLikeRepository.deleteLike = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    const getLikeCommentUseCase = new LikeCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      likeRepository: mockLikeRepository,
    });

    // Action
    await getLikeCommentUseCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.validateId).toBeCalledWith(
      useCasePayload.threadId
    );
    expect(mockCommentRepository.validateId).toBeCalledWith(
      useCasePayload.commentId
    );
    expect(mockLikeRepository.validateLikeExist).toBeCalledWith(useCasePayload);
    expect(mockLikeRepository.deleteLike).toBeCalledWith(useCasePayload);
  });
});
