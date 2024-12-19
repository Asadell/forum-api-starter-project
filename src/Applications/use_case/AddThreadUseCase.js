const AddThread = require('../../Domains/threads/entities/AddThread');
let index = 1;

class AddThreadUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    const thread = new AddThread(useCasePayload);

    return this._threadRepository.addThread(thread);
  }
}

module.exports = AddThreadUseCase;
