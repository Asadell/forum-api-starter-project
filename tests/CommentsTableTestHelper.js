/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const CommentsTableTestHelper = {
  async addComment({ id, content, userId, threadId }) {
    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4)',
      values: [id, content, userId, threadId],
    };

    await pool.query(query);
  },

  async findCommentById(commentId) {
    const query = {
      text: 'SELECT 1 FROM comments WHERE id = $1 AND is_delete != TRUE',
      values: [commentId],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query('DELETE FROM comments WHERE 1=1');
  },
};

module.exports = CommentsTableTestHelper;
