const GetComment = require('../../Domains/comments/entities/GetComment');
const GetReply = require('../../Domains/comments/entities/GetReply');
// master
class GetThreadUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
    console.log('MULAIIIII');
    const { threadId } = useCasePayload;
    await this._threadRepository.validateId(threadId);
    const thread = await this._threadRepository.getThreadById(threadId);
    const comments = await this._commentRepository.getCommentsByThreadId(
      threadId
    );
    const repliesDetail = await this._commentRepository.getRepliesByCommentId(
      threadId
    );

    thread.comments = comments.map(
      (comment) =>
        new GetComment({
          ...comment,
          replies: comment.is_delete
            ? []
            : repliesDetail
                .filter((reply) => reply.comment === comment.id)
                .map((reply) => new GetReply(reply)),
        })
    );

    // if (comments.length > 0) {
    //   thread.comments = await Promise.all(
    //     comments.map(async (comment) => {
    //       const replies = await this._commentRepository.getRepliesByCommentId(
    //         comment.id
    //       );
    //       if (replies.length === 0) {
    //         return new GetComment(comment);
    //       }
    //       return {
    //         ...new GetComment(comment),
    //         replies: replies.map((reply) => new GetReply(reply)),
    //       };
    //     })
    //   );
    // }

    return thread;
  }
}

module.exports = GetThreadUseCase;
