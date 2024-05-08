import app from "./app.js";
import { connectToDatabase } from "./db/connection.js";
const PORT = process.env.PORT;
connectToDatabase()
    .then(() => {
    app.listen(PORT, () => console.log("Server is listening"));
})
    .catch(err => console.log(err));
//# sourceMappingURL=index.js.map