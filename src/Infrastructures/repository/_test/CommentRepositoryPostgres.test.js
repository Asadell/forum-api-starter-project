const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AddComment = require('../../../Domains/comments/entities/AddComment');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const AddedReply = require('../../../Domains/comments/entities/AddedReply');
const AddReply = require('../../../Domains/comments/entities/AddReply');
const pool = require('../../database/postgres/pool');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');

const userId = 'user-123';
const threadId = 'thread-123';
const commentId = 'comment-123';
const replyId = 'reply-123';

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
      const comments = await CommentsTableTestHelper.findCommentById(commentId);
      expect(comments).toHaveLength(1);
    });

    it('should return added comment correctly', async () => {
      // Arrange
      const registerComment = new AddComment({
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
      const registeredComment = await commentRepositoryPostgres.addComment(
        registerComment
      );

      // Assert
      expect(registeredComment).toStrictEqual(
        new AddedComment({
          id: commentId,
          content: registerComment.content,
          owner: userId,
        })
      );
    });
  });

  describe('validateId function', () => {
    it('should throw NotFoundError when comment not found', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action n Assert
      await expect(
        commentRepositoryPostgres.validateId(commentId)
      ).rejects.toThrowError(NotFoundError);
    });

    it('should not throw NotFoundError when comment found', async () => {
      // Arrange
      const comment = {
        id: commentId,
        content: 'content',
        threadId,
        userId,
      };
      await CommentsTableTestHelper.addComment(comment);

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action n Arrange
      await expect(
        commentRepositoryPostgres.validateId(commentId)
      ).resolves.not.toThrowError(NotFoundError);
    });
  });

  describe('validateCommentOwner function', () => {
    it('should throw AuthorizationError when No Authentication', async () => {
      // Arrange
      const userId2 = 'user-321';
      await UsersTableTestHelper.addUser({
        id: userId2,
        username: 'asadel2',
        password: 'secret',
        fullname: 'aasadel',
      });
      const comment = {
        id: commentId,
        content: 'content',
        threadId,
        userId,
      };
      await CommentsTableTestHelper.addComment(comment);

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action n Assert
      await expect(
        commentRepositoryPostgres.validateCommentOwner(commentId, userId2)
      ).rejects.toThrowError(AuthorizationError);
    });
  });

  describe('deleteComment function', () => {
    it('should deleted comment correctly', async () => {
      // Arrange
      const comment = {
        id: commentId,
        content: 'contentasdfas',
        threadId,
        userId,
      };
      await CommentsTableTestHelper.addComment(comment);

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action n Arrange
      await commentRepositoryPostgres.deleteComment(commentId);
      const comments = await CommentsTableTestHelper.findCommentById(commentId);

      expect(comments).toHaveLength(0);
    });
  });

  describe('getCommentsByThreadId function', () => {
    it('should deleted comment correctly', async () => {
      // Arrange
      const comment = {
        id: commentId,
        content: 'content',
        threadId,
        userId,
      };
      const { currentCommentId } = await CommentsTableTestHelper.addComment(
        comment
      );

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action
      const getComment = await commentRepositoryPostgres.getCommentsByThreadId(
        threadId
      );

      // Arrange
      expect(getComment[0].id).toEqual(commentId);
      expect(getComment[0].content).toEqual(comment.content);
      expect(getComment[0].username).toEqual('asadel');
      expect(getComment[0]).toHaveProperty('date');
    });
  });

  describe('addReply function', () => {
    beforeEach(async () => {
      await CommentsTableTestHelper.addComment({
        id: commentId,
        content: 'reply content',
        threadId,
        userId,
      });
    });

    it('should persist add reply and return added reply correctly', async () => {
      // Arrange
      const reply = new AddReply({
        content: 'content',
        threadId,
        commentId,
        userId,
      });
      const fakeIdGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action
      await commentRepositoryPostgres.addReply(reply);

      // Assert
      const replys = await CommentsTableTestHelper.findCommentById(replyId);
      expect(replys).toHaveLength(1);
    });

    it('should return added reply correctly', async () => {
      // Arrange
      const reply = new AddReply({
        content: 'reply content',
        threadId,
        commentId,
        userId,
      });
      const fakeIdGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action
      const addedReply = await commentRepositoryPostgres.addReply(reply);

      // Assert
      expect(addedReply).toStrictEqual(
        new AddedReply({
          id: replyId,
          content: reply.content,
          owner: userId,
        })
      );
    });
  });

  describe('validateReplyId', () => {
    it('should throw NotFoundError when reply not found', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action n Assert
      await expect(
        commentRepositoryPostgres.validateReplyId(replyId)
      ).rejects.toThrowError(NotFoundError);
    });

    it('should not throw NotFoundError when comment found', async () => {
      // Arrange
      await CommentsTableTestHelper.addComment({
        id: commentId,
        content: 'reply content',
        threadId,
        userId,
      });
      await CommentsTableTestHelper.addReply({
        id: replyId,
        content: 'reply content',
        threadId,
        userId,
      });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action n Arrange
      await expect(
        commentRepositoryPostgres.validateReplyId(replyId)
      ).resolves.not.toThrowError(NotFoundError);
    });
  });

  describe('deleteReply function', () => {
    it('should deleted reply correctly', async () => {
      // Arrange
      await CommentsTableTestHelper.addComment({
        id: commentId,
        content: 'reply content',
        threadId,
        userId,
      });
      await CommentsTableTestHelper.addReply({
        id: replyId,
        content: 'reply content',
        threadId,
        userId,
      });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action n Arrange
      const comments1 = await CommentsTableTestHelper.findCommentById(replyId);
      await commentRepositoryPostgres.deleteReply(replyId);
      const comments2 = await CommentsTableTestHelper.findCommentById(replyId);

      expect(comments1).toHaveLength(1);
      expect(comments2).toHaveLength(0);
    });
  });
});
