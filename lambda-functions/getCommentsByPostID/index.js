const Sequelize = require("sequelize");

const sequelize = new Sequelize({
  dialect: process.env.TSNET_DB_DIALECT,
  host: process.env.TSNET_DB_HOST,
  database: process.env.TSNET_DB_DATABASE,
  port: process.env.TSNET_DB_PORT,
  username: process.env.TSNET_DB_USER,
  password: process.env.TSNET_DB_PASSWORD,
});

const Comment = sequelize.define("Comment", {
  CommentID: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
  },
  UserID: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  PostID: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  Content: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
});

exports.handler = async (event, context) => {
  try {
    await testDatabaseConnection();
    const postId = event.pathParameters.post_id;

    // Retrieve comments by PostID from the database
    const comments = await Comment.findAll({
      where: {
        PostID: postId,
      },
    });

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status: "ok",
        comments,
      }),
    };
  } catch (error) {
    console.error("Error retrieving comments:", error);

    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: "Error retrieving comments",
      }),
    };
  }
};

const testDatabaseConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection to the database has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};
