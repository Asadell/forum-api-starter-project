const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const CommentRepository = require('../../Domains/comments/CommentRepository');
const AddedComment = require('../../Domains/comments/entities/AddedComment');

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addComment(comment) {
    const { content, userId, threadId } = comment;
    const id = `comment-${this._idGenerator()}`;

    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4) RETURNING id, content, owner',
      values: [id, content, userId, threadId],
    };

    const result = await this._pool.query(query);

    return new AddedComment(result.rows[0]);
  }

  async validateId(commentId) {
    const query = {
      text: 'SELECT 1 FROM comments WHERE id = $1 AND is_delete = FALSE',
      values: [commentId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      console.log('DELETAAAAAAA');
      throw new NotFoundError('Comment tidak ditemukan');
    }
  }

  async validateCommentOwner(commentId, userId) {
    const query = {
      text: 'SELECT 1 FROM comments WHERE id = $1 AND owner = $2',
      values: [commentId, userId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new AuthorizationError('Anda tidak boleh mengakses resource ini');
    }
  }

  async deleteComment(commentId) {
    const query = {
      text: 'UPDATE comments SET is_delete = TRUE WHERE id = $1',
      values: [commentId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      console.log(commentId);
      console.log('DELETEEEEE');
      throw new NotFoundError('Comment tidak ditemukan');
    }
  }
}

module.exports = CommentRepositoryPostgres;
