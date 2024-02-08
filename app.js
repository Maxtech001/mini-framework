/* eslint-disable no-undef */
const express = require("express");
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;
// Serve files from 'framework' directory
app.use("/framework", express.static(path.join(__dirname, "framework")));

// Serve files from 'src' directory
app.use("/src", express.static(path.join(__dirname, "src")));

// Catch-all route for all other requests, serves 'index.html'
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(PORT, () => {
    console.log(`Server ready at http://localhost:${PORT}`);
});
