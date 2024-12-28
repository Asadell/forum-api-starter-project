/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const LikesTableTestHelper = {
  async addLike(like) {
    const { likeId, commentId, userId } = like;

    const query = {
      text: 'INSERT INTO likes VALUES ($1, $2, $3) RETURNING id',
      values: [likeId, commentId, userId],
    };

    const response = await pool.query(query);

    return response.rows[0];
  },

  async findLikeById(likeId) {
    const query = {
      text: 'SELECT 1 FROM likes WHERE id = $1',
      values: [likeId],
    };

    const result = await pool.query(query);

    return result.rows;
  },

  async cleanTable() {
    await pool.query('DELETE FROM likes WHERE 1=1');
  },
};

module.exports = LikesTableTestHelper;
