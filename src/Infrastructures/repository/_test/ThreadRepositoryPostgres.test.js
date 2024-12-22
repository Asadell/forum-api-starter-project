const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const AddThread = require('../../../Domains/threads/entities/AddThread');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');

const userId = 'user-123';
const threadId = 'thread-123';

describe('ThreadRepositoryPostgres', () => {
  beforeAll(async () => {
    await UsersTableTestHelper.addUser({
      id: userId,
      username: 'asadel',
      password: 'secret',
      fullname: 'Dicoding Indonesia',
    });
  });

  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await UsersTableTestHelper.cleanTable();
    await pool.end();
  });

  describe('addThread function', () => {
    it('should persist add thread and return added thread correctly', async () => {
      // Arrange
      const thread = new AddThread({
        title: 'dicoding',
        body: 'Dicoding Indonesia',
        userId,
      });
      const fakeIdGenerator = () => '123'; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action
      await threadRepositoryPostgres.addThread(thread);

      // Assert
      const threads = await ThreadsTableTestHelper.findThreadById(threadId);
      expect(threads).toHaveLength(1);
    });

    it('should return added thread correctly', async () => {
      // Arrange
      const registerThread = new AddThread({
        title: 'dicoding',
        body: 'Dicoding Indonesia',
        userId,
      });

      const fakeIdGenerator = () => '123'; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action
      const registeredThread = await threadRepositoryPostgres.addThread(
        registerThread
      );

      // Assert
      expect(registeredThread).toStrictEqual(
        new AddedThread({
          id: threadId,
          title: registerThread.title,
          owner: userId,
        })
      );
    });
  });

  describe('validateId function', () => {
    it('should throw NotFoundError when thread not found', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action n Assert
      await expect(
        threadRepositoryPostgres.validateId(threadId)
      ).rejects.toThrowError(NotFoundError);
    });

    it('should not throw NotFoundError when thread found', async () => {
      // Arrange
      const thread = new AddThread({
        title: 'dicoding',
        body: 'Dicoding Indonesia',
        userId,
      });
      await ThreadsTableTestHelper.addThread({ ...thread, id: threadId });

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action n Arrange
      await expect(
        threadRepositoryPostgres.validateId(threadId)
      ).resolves.not.toThrowError(NotFoundError);
    });
  });

  describe('getThreadById function', () => {
    it('should get thread correctly', async () => {
      // Arrange
      const registerThread = new AddThread({
        title: 'dicoding',
        body: 'Dicoding Indonesia',
        userId,
      });
      await ThreadsTableTestHelper.addThread({
        id: threadId,
        title: 'dicoding',
        body: 'Dicoding Indonesia',
        userId,
      });

      const fakeIdGenerator = () => '123'; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator
      );
      // const registeredThread = await threadRepositoryPostgres.addThread(
      //   registerThread
      // );

      // Action
      const getThread = await threadRepositoryPostgres.getThreadById(threadId);

      // Assert
      expect(getThread.id).toEqual(threadId);
      expect(getThread.title).toEqual(registerThread.title);
      expect(getThread.body).toEqual(registerThread.body);
      expect(getThread).toHaveProperty('date');
      expect(getThread.username).toEqual('asadel');
    });

    it('should throw NotFoundError when thread not found', async () => {
      // Arrange
      const failThreadId = 'thread-321';

      const fakeIdGenerator = () => '123'; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action n Assert
      await expect(
        threadRepositoryPostgres.getThreadById(failThreadId)
      ).rejects.toThrowError(NotFoundError);
    });
  });
});
