const dotenv = require("dotenv");
const app = require("./app");
const userRoutes = require("./../routes/userRoutes");
const claimsRoutes = require("./../routes/claimsRoutes");

dotenv.config({ path: "./config/config.env" });

app.use("/api/user", userRoutes);
app.use("/api/claims", claimsRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
