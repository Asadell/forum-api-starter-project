/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('likes', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    comment_id: {
      type: 'VARCHAR(50)',
      notNull: true,
      references: 'comments(id)',
    },
    owner: {
      type: 'VARCHAR(50)',
      notNull: true,
      references: 'users(id)',
    },
  });

  pgm.addConstraint(
    'likes',
    'unique_comment_and_owner',
    'UNIQUE(comment_id, owner)'
  );
};

exports.down = (pgm) => {
  pgm.dropTable('likes');
};
