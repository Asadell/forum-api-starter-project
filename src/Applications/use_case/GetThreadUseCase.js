const GetComment = require('../../Domains/comments/entities/GetComment');
const GetReply = require('../../Domains/comments/entities/GetReply');

class GetThreadUseCase {
  constructor({ threadRepository, commentRepository, likeRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._likeRepository = likeRepository;
  }

  async execute(useCasePayload) {
    const { threadId } = useCasePayload;
    await this._threadRepository.validateId(threadId);
    const thread = await this._threadRepository.getThreadById(threadId);
    const comments = await this._commentRepository.getCommentsByThreadId(
      threadId,
    );

    thread.comments = await Promise.all(
      comments.map(async (comment) => {
        const replies = await this._commentRepository.getRepliesByCommentId(
          comment.id,
        );
        const likeCount = await this._likeRepository.getLikesByCommentId(
          comment.id,
        );
        const commentCopy = { ...comment, likeCount };

        const commentWithReplies = new GetComment(commentCopy);
        commentWithReplies.replies = replies.length > 0 ? replies.map((reply) => new GetReply(reply)) : [];

        return commentWithReplies;
      }),
    );

    return thread;
  }
}

module.exports = GetThreadUseCase;
