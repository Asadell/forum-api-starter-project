const AddThreadUseCase = require('../../../../Applications/use_case/AddThreadUseCase');

class ThreadsHandler {
  constructor(container) {
    this._container = container;

    this.postThreadHandler = this.postThreadHandler.bind(this);
  }

  async postThreadHandler(request, h) {
    // console.log('thread handler');
    console.log(`request: ${JSON.stringify(request.payload)}`);
    // console.log('LOH');
    const addThreadUseCase = this._container.getInstance(AddThreadUseCase.name);
    // console.log('otw execute1');
    // console.log(addThreadUseCase);
    // console.log('otw execute2');
    const addedThread = await addThreadUseCase.execute({
      ...request.payload,
      userId: request.auth.credentials.id,
    });

    const response = h.response({
      status: 'success',
      data: { addedThread },
    });

    response.code(201);
    return response;
  }
}

module.exports = ThreadsHandler;
