const DeleteComment = require('../../Domains/comments/entities/DeleteComment');

class DeleteCommentUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
    const comment = new DeleteComment(useCasePayload);

    await this._threadRepository.validateId(comment.threadId);
    await this._commentRepository.validateId(comment.commentId);
    await this._commentRepository.validateCommentOwner(
      comment.commentId,
      comment.userId
    );

    return this._commentRepository.deleteComment(comment.commentId);
  }
}

module.exports = DeleteCommentUseCase;
