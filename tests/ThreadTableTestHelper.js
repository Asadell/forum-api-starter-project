/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const ThreadTableTestHelper = {
  async findThreadById(threadId) {
    const query = {
      text: 'select 1 from threads where id = $1',
      values: [threadId],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query('DELETE from threads WHERE 1=1');
  },
};

module.exports = ThreadTableTestHelper;
