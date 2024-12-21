const GetComment = require('../../Domains/comments/entities/GetComment');

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
      thread.comments = comments.map((comment) => new GetComment(comment));
    }

    return thread;
  }
}

module.exports = GetThreadUseCase;
