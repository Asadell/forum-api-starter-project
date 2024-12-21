const AddThreadUseCase = require('../../../../Applications/use_case/AddThreadUseCase');
const GetThreadUseCase = require('../../../../Applications/use_case/GetThreadUseCase');

class ThreadsHandler {
  constructor(container) {
    this._container = container;

    this.postThreadHandler = this.postThreadHandler.bind(this);
  }

  async postThreadHandler(request, h) {
    const addThreadUseCase = this._container.getInstance(AddThreadUseCase.name);
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

  async getThreadHandler(request, h) {
    console.log('=== MULAI HANDLER');
    const getThreadUseCase = this._container.getInstance(GetThreadUseCase.name);
    const thread = await getThreadUseCase.execute({
      ...request.params,
    });

    console.log('=== SELESAI HANDLER');
    const response = h.response({
      status: 'success',
      data: { thread },
    });

    response.code(200);
    return response;
  }
}

module.exports = ThreadsHandler;
