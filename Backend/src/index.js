//src/index.js
import express from "express";
import cors from "cors";
import userRoleRoutes from "./routes/userRoleRoute.js"
import typeDocumentRoutes from "./routes/typeDocumentRoute.js"
import lineRoutes from "./routes/lineRoute.js"
import originRoutes from "./routes/originRoute.js"
import priorityRoutes from "./routes/priorityRoute.js"
import activityTypeRoutes from "./routes/activityTypeRoute.js"
import stateRoutes from "./routes/stateRoute.js"
import stateTaskRoutes from "./routes/stateTaskRoute.js"
import customerRoutes from "./routes/customerRoute.js"
import contactRoutes from "./routes/contactRoute.js"
import userRoutes from "./routes/userRoute.js"
import leadRoutes from "./routes/leadRoute.js"
import taskRoutes from "./routes/taskRoute.js"
import commentRoutes from "./routes/commentRoute.js"
import activityRoutes from "./routes/activityRoute.js"
import countryRoutes from "./routes/countryRoute.js"
import cityRoutes from "./routes/cityRoute.js"
import categoryRoutes from "./routes/categoryRoutes.js"
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal server error" });
});

app.use('/api', userRoleRoutes)
app.use('/api', typeDocumentRoutes)
app.use('/api', lineRoutes)
app.use('/api', originRoutes)
app.use('/api', priorityRoutes)
app.use('/api', activityTypeRoutes)
app.use('/api', stateRoutes)
app.use('/api', stateTaskRoutes)
app.use('/api/customer', customerRoutes)
app.use('/api', contactRoutes)
app.use('/api/user', userRoutes)
app.use('/api/lead', leadRoutes)
app.use('/api', taskRoutes)
app.use('/api', commentRoutes)
app.use('/api', activityRoutes)
app.use('/api/country', countryRoutes)
app.use('/api', cityRoutes)
app.use('/api', categoryRoutes)


app.listen(port);
