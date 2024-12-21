/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const CommentsTableTestHelper = {
  async addComment({ id, content, userId, threadId }) {
    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4) RETURNING id',
      values: [id, content, userId, threadId],
    };

    const response = await pool.query(query);

    return response.rows[0];
  },

  async addReply({ id, content, threadId, commentId, userId }) {
    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5) RETURNING id',
      values: [id, content, userId, threadId, commentId],
    };

    const response = await pool.query(query);

    return response.rows[0];
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
