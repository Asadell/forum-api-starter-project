const LikeCommentUseCase = require('../../../../Applications/use_case/LikeCommentUseCase');

class LikesCommentHandler {
  constructor(container) {
    this._container = container;

    this.putLikesCommenthandler = this.putLikesCommenthandler.bind(this);
  }

  async putLikesCommenthandler(request, h) {
    const likeCommentUseCase = this._container.getInstance(
      LikeCommentUseCase.name,
    );
    await likeCommentUseCase.execute({
      ...request.params,
      userId: request.auth.credentials.id,
    });

    const response = h.response({
      status: 'success',
    });

    response.code(200);
    return response;
  }
}

module.exports = LikesCommentHandler;
