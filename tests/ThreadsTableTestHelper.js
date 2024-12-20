/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const ThreadsTableTestHelper = {
  async addThread(thread) {
    const { id, title, body, userId } = thread;

    const query = {
      text: 'INSERT INTO threads VALUES($1, $2, $3, $4) RETURNING id, title, owner',
      values: [id, title, body, userId],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async findThreadById(threadId) {
    const query = {
      text: 'SELECT 1 FROM threads WHERE id = $1',
      values: [threadId],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query('DELETE FROM threads WHERE 1=1');
  },
};

module.exports = ThreadsTableTestHelper;
