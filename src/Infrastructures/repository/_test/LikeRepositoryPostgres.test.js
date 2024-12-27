const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const LikesTableTestHelper = require('../../../../tests/LikesTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const Like = require('../../../Domains/likes/entities/Like');
const pool = require('../../database/postgres/pool');
const LikeRepositoryPostgres = require('../LikeRepositoryPostgres');

const userId = 'user-123';
const threadId = 'thread-123';
const commentId = 'comment-123';
const likeId = 'like-123';

describe('LikeRepositoryPostgres', () => {
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
      userId,
    });
    await CommentsTableTestHelper.addComment({
      id: commentId,
      content: 'content',
      userId,
      threadId,
    });
  });

  afterEach(async () => {
    await LikesTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await pool.end();
  });

  describe('addLike function', () => {
    it('should add like correctly', async () => {
      // Arrange
      const like = new Like({
        threadId,
        commentId,
        userId,
      });

      const fakeIdGenerator = () => '123'; // stub!
      const likeRepositoryPostgres = new LikeRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action
      await likeRepositoryPostgres.addLike(like);

      // Assert
      const likes = await LikesTableTestHelper.findLikeById(likeId);

      expect(likes).toHaveLength(1);
    });
  });

  describe('deleteLike function', () => {
    it('should deleted like correctly', async () => {
      // Arrange
      const like = new Like({
        threadId,
        commentId,
        userId,
      });
      await LikesTableTestHelper.addLike({ ...like, likeId });

      const fakeIdGenerator = () => '123'; // stub!
      const likeRepositoryPostgres = new LikeRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action
      await likeRepositoryPostgres.deleteLike(like);

      // Assert
      const likes = await LikesTableTestHelper.findLikeById(likeId);

      expect(likes).toHaveLength(0);
    });

    it('should throw NotFoundError when comment not found', async () => {
      // Arrange
      const failCommentId = 'comment-321';
      const like = new Like({
        threadId,
        commentId,
        userId,
      });
      await LikesTableTestHelper.addLike({ ...like, likeId });
      like.commentId = failCommentId;

      const fakeIdGenerator = () => '123'; // stub!
      const likeRepositoryPostgres = new LikeRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action n Assert
      await expect(
        likeRepositoryPostgres.deleteLike(like)
      ).rejects.toThrowError(NotFoundError);
    });
  });

  describe('validateLikeExist function', () => {
    it('should return false when like is not exist', async () => {
      // Arrange
      const like = new Like({
        threadId,
        commentId,
        userId,
      });
      // await LikesTableTestHelper.addLike({ ...like, likeId });

      const fakeIdGenerator = () => '123'; // stub!
      const likeRepositoryPostgres = new LikeRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action n Assert
      await expect(
        likeRepositoryPostgres.validateLikeExist(like)
      ).resolves.toEqual(0);
    });

    it('should return true when like is exist', async () => {
      // Arrange
      const like = new Like({
        threadId,
        commentId,
        userId,
      });
      await LikesTableTestHelper.addLike({ ...like, likeId });

      const fakeIdGenerator = () => '123'; // stub!
      const likeRepositoryPostgres = new LikeRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action n Assert
      await expect(
        likeRepositoryPostgres.validateLikeExist(like)
      ).resolves.toEqual(1);
    });
  });

  describe('getLikesByCommentId function', () => {
    it('should get amount of likes correctly', async () => {
      // Arrange
      const like = new Like({
        threadId,
        commentId,
        userId,
      });
      await LikesTableTestHelper.addLike({ ...like, likeId });

      const fakeIdGenerator = () => '123'; // stub!
      const likeRepositoryPostgres = new LikeRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action n Assert
      await expect(
        likeRepositoryPostgres.getLikesByCommentId(commentId)
      ).resolves.toEqual(1);
    });
  });
});
