
const Sequelize = require('sequelize');

const sequelize = new Sequelize({
  dialect: process.env.TSNET_DB_DIALECT,
  host: process.env.TSNET_DB_HOST,
  database: process.env.TSNET_DB_DATABASE,
  port: process.env.TSNET_DB_PORT,
  username: process.env.TSNET_DB_USER,
  password: process.env.TSNET_DB_PASSWORD,
});

const Post = sequelize.define('Post', {
  PostID: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
  },
  UserID: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  content: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
  MediaLink: {
    type: Sequelize.STRING,
    allowNull: true,
  },
});

exports.handler = async (event, context) => {
  try {
    
    const user_id = event.pathParameters.user_id;

    const posts = await Post.findAll({
      where: {
        UserID: user_id,
      },
    });

    // Map the posts to the desired format
    const formattedPosts = posts.map(post => ({
      id: post.PostID,
      user_id: post.UserID,
      content: post.content,
      MediaLink: post.media_link,
    }));

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        status:"ok",
        posts: formattedPosts,
      }),
    };
  } catch (error) {
    console.error('Error retrieving posts:', error);

    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: 'Error retrieving posts',
      }),
    };
  }
};
