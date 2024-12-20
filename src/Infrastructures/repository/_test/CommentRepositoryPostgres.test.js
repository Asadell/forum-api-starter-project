const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AddComment = require('../../../Domains/comments/entities/AddComment');
const pool = require('../../database/postgres/pool');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');

const userId = 'user-123';
const threadId = 'thread-123';

describe('CommentRepositoryPostgres', () => {
  beforeAll(async () => {
    await UsersTableTestHelper.addUser({
      id: userId,
      username: 'asadel',
      password: 'secret',
      fullname: 'aasadel',
    });
    await ThreadsTableTestHelper.addThread({
      id: threadId,
      title: 'title',
      body: 'body',
      userId: userId,
    });
  });

  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await pool.end();
  });

  describe('addComment function', () => {
    it('should persist add comment and return added comment correctly', async () => {
      console.log('== MULAI ==');
      // Arrange
      const comment = new AddComment({
        content: 'content',
        userId,
        threadId,
      });
      const fakeIdGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action
      await commentRepositoryPostgres.addComment(comment);

      // Assert
      const comments = await CommentsTableTestHelper.findCommentById(
        'thread-123'
      );
      expect(comments).toHaveLength(1);
      console.log('== SELESAI ==');
    });
  });
});
