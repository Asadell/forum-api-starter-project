const AddReply = require('../../Domains/comments/entities/AddReply');

class AddReplyUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
    const reply = new AddReply(useCasePayload);

    await this._threadRepository.validateId(reply.threadId);
    await this._commentRepository.validateId(reply.commentId);

    return this._commentRepository.addReply(reply);
  }
}

module.exports = AddReplyUseCase;
