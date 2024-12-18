class AddedThread {
  constructor(payload) {
    this._verifyPayload(payload);
  }

  _verifyPayload({ id, title, body }) {
    if (!id || !title || !body) {
      throw new Error('THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      typeof id !== 'string' ||
      typeof title !== 'string' ||
      typeof body !== 'string'
    ) {
      throw new Error('THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = AddedThread;
