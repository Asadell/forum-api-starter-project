const AddThread = require('../../Domains/threads/entities/AddThread');
let index = 1;

class AddThreadUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    console.log(index++);
    console.log('executing');
    const thread = new AddThread(useCasePayload);
    console.table(`thread: ${JSON.stringify(thread)}`);

    return this._threadRepository.addThread(thread);
  }
}

module.exports = AddThreadUseCase;
