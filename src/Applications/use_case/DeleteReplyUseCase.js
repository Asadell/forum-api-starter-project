const DeleteReply = require('../../Domains/comments/entities/DeleteReply');

class DeleteReplyUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
    const reply = new DeleteReply(useCasePayload);

    await this._threadRepository.validateId(reply.threadId);
    await this._commentRepository.validateId(reply.commentId);
    await this._commentRepository.validateReplyId(reply.replyId);
    await this._commentRepository.validateCommentOwner(
      reply.replyId,
      reply.userId,
    );

    return this._commentRepository.deleteReply(reply.replyId);
  }
}

module.exports = DeleteReplyUseCase;
