db = db.getSiblingDB("trivia");

// Create user for the trivia database
db.createUser({
  user: "trivia_user",
  pwd: "trivia_password",
  roles: [
    {
      role: "readWrite",
      db: "trivia",
    },
  ],
});

// Create collections
db.createCollection("categories");
db.createCollection("quizzes");

// Create indexes
db.categories.createIndex({ id: 1 }, { unique: true });
db.quizzes.createIndex({ createdAt: 1 });
db.quizzes.createIndex({ userId: 1 });
