require("dotenv").config({ path: "./.env" });
const { Keystone } = require("@keystonejs/keystone");
const { createItems } = require("@keystonejs/server-side-graphql-client");
const { PasswordAuthStrategy } = require("@keystonejs/auth-password");
const { MongooseAdapter: Adapter } = require("@keystonejs/adapter-mongoose");
const { GraphQLApp } = require("@keystonejs/app-graphql");
const { AdminUIApp } = require("@keystonejs/app-admin-ui");

// Seed data
const initialiseUsers = require("./seeds/users");

const PROJECT_NAME = "Enneagram Assessment";
const adapterConfig = {
  mongoUri: process.env.MONGO_URI,
};

// Schemas
const UserSchema = require("./lists/User");
const QuestionSchema = require("./lists/Question");
const AnswerSchema = require("./lists/Answer");
const ResultSchema = require("./lists/Result");

// Create Keystone Instance
const keystone = new Keystone({
  adapter: new Adapter(adapterConfig),
  onConnect: async (keystone) => {
    // process.env.CREATE_TABLES !== "true" && initialiseUsers;
    const questions = await keystone.lists.Question.adapter.findAll();
    if (!questions.length) {
      const initialData = require('./seeds/questions');
      await createItems({ keystone, listKey: 'Question', items: initialData.Question });
      console.log('\n✅ Added Questions');
    } else {
      console.log('\n❌ Already have questions loaded in')
    }
  },
  cookie: {
    secure: false, // true for production, false for development,
  },
  cookieSecret: process.env.COOKIE_SECRET,
});

// Create Lists
keystone.createList("User", UserSchema);
keystone.createList("Question", QuestionSchema);
keystone.createList("Answer", AnswerSchema);
keystone.createList("Result", ResultSchema);

const authStrategy = keystone.createAuthStrategy({
  type: PasswordAuthStrategy,
  list: "User",
});

module.exports = {
  keystone,
  apps: [
    new GraphQLApp(),
    new AdminUIApp({
      name: PROJECT_NAME,
      enableDefaultRoute: true,
      // authStrategy,
    }),
  ],
  configureExpress: (app) => {
    app.set("trust proxy", true);
  },
};
