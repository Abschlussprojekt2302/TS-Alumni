const Sequelize = require("sequelize");

let apiEvent = {};

exports.handler = async (event, context) => {
  try {
    const data = JSON.parse(event.body);
    apiEvent = {
      version: "2.0",
      routeKey: "POST /login/google",
      userData: {
        id: data.userData.id,
        email: data.userData.email,
        name: data.userData.name,
        given_name: data.userData.given_name,
        family_name: data.userData.family_name,
        picture: data.userData.picture,
      },
      isBase64Encoded: true,
    };

    await main();

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: "UserData processed", apiEvent }),
    };
  } catch (error) {
    console.error(error);
    event.status(500).send("Error processing request");
  }
};

const sequelize = new Sequelize({
  dialect: process.env.TSNET_DB_DIALECT,
  host: process.env.TSNET_DB_HOST,
  database: process.env.TSNET_DB_DATABASE,
  port: process.env.TSNET_DB_PORT,
  username: process.env.TSNET_DB_USER,
  password: process.env.TSNET_DB_PASSWORD,
});

const main = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");

    const ed = apiEvent.userData;

    const [existingUser, _] = await sequelize.query(`
      SELECT * FROM User WHERE UserID = '${ed.id}'
    `);

    if (existingUser.length > 0) {
      console.log("User vorhanden");
    } else {
      await sequelize.query(`
        INSERT INTO User (UserID, RealName, EmailAddress, BirthDate, Course, AuthProvider, ProfileImg)
        VALUES ('${ed.id}', '${ed.name}', '${ed.email}', null, null, null, '${ed.picture}')
        ON DUPLICATE KEY UPDATE
          UserID = VALUES(UserID),
          EmailAddress = VALUES(EmailAddress),
          RealName = VALUES(RealName),
          BirthDate = VALUES(BirthDate),
          Course = VALUES(Course),
          AuthProvider = VALUES(AuthProvider),
          ProfileImg = VALUES(ProfileImg);
      `);

      console.log("Neuer Eintrag in der Datenbank erstellt");
    }

    const [results, metadata] = await sequelize.query("SELECT * FROM User");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};