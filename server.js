import express from "express";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { createServer } from "http";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// Serve static files from the dist directory
app.use(express.static(join(__dirname, "dist")));

// Implement the history API fallback - all requests not going to static files will be redirected to index.html
app.get("*", (req, res) => {
  res.sendFile(join(__dirname, "dist", "index.html"));
});

const server = createServer(app);

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
