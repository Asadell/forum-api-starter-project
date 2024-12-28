const Like = require('../../Domains/likes/entities/Like');

class LikeCommentUseCase {
  constructor({ threadRepository, commentRepository, likeRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._likeRepository = likeRepository;
  }

  async execute(useCasePayload) {
    const like = new Like(useCasePayload);

    await this._threadRepository.validateId(like.threadId);
    await this._commentRepository.validateId(like.commentId);
    const isCommentLiked = await this._likeRepository.validateLikeExist(like);

    if (isCommentLiked) {
      await this._likeRepository.deleteLike(like);
    } else {
      await this._likeRepository.addLike(like);
    }
  }
}

module.exports = LikeCommentUseCase;
