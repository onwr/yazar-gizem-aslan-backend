const express = require("express");
const compression = require("compression");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const cors = require("cors");
require("dotenv").config();

const booksRouter = require("./routes/books");
const chaptersRouter = require("./routes/chapters");
const commentsRouter = require("./routes/comments");
const adminRouter = require("./routes/admin");
const signingEventsRouter = require("./routes/signingEvents");
const storeBooksRouter = require("./routes/storeBooks");
const bookPurchaseRouter = require("./routes/bookPurchase");
const readerQuestionsRouter = require("./routes/readerQuestions");
const announcementsRouter = require("./routes/announcements");
const lineCommentsRouter = require("./routes/lineComments");
const newsFlowRouter = require("./routes/newsFlow");
const errorHandler = require("./middleware/errorHandler");

const app = express();

app.use(helmet());
app.use(compression());

const corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

app.use(
  express.json({
    limit: "50mb",
    parameterLimit: 100000,
    extended: true,
  })
);

app.use(
  express.urlencoded({
    limit: "50mb",
    parameterLimit: 100000,
    extended: true,
  })
);

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 1200,
});
app.use(limiter);

app.use("/books", booksRouter);
app.use("/chapters", chaptersRouter);
app.use("/chapterComments", commentsRouter);
app.use("/admin", adminRouter);
app.use("/signingEvents", signingEventsRouter);
app.use("/store-books", storeBooksRouter);
app.use("/book-purchase", bookPurchaseRouter);
app.use("/reader-questions", readerQuestionsRouter);
app.use("/announcements", announcementsRouter);
app.use("/line-comments", lineCommentsRouter);
app.use("/news-flow", newsFlowRouter);

app.use(errorHandler);

app.use((req, res) => {
  res.status(404).json({ error: "Endpoint bulunamadı" });
});

app.use((err, req, res, next) => {
  console.error("Global error handler:", err);
  res.status(500).json({
    error: "Sunucu hatası oluştu",
    details: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`KÜRKAYA YAZILIM. ${PORT}`);
});

module.exports = app;
