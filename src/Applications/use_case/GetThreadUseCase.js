const GetComment = require('../../Domains/comments/entities/GetComment');
const GetReply = require('../../Domains/comments/entities/GetReply');
// submission-fix
class GetThreadUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
    const { threadId } = useCasePayload;
    await this._threadRepository.validateId(threadId);
    const thread = await this._threadRepository.getThreadById(threadId);
    const comments = await this._commentRepository.getCommentsByThreadId(
      threadId
    );

    if (comments.length > 0) {
      thread.comments = await Promise.all(
        comments.map(async (comment) => {
          const replies = await this._commentRepository.getRepliesByCommentId(
            comment.id
          );

          const commentWithReplies = new GetComment(comment);
          if (replies.length > 0) {
            commentWithReplies.replies = replies.map(
              (reply) => new GetReply(reply)
            );
          }

          return commentWithReplies;
        })
      );
    }

    console.log(thread);

    return thread;
  }
}

module.exports = GetThreadUseCase;
