const mongoose = require('mongoose');

module.exports = async () => {
    try {
        const connectionParams = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        };
        await mongoose.connect(
            "mongodb+srv://hira-adrian:hira-adrian@todolist.lit5i.mongodb.net/db_todolist?retryWrites=true&w=majority",
            connectionParams
        );
        console.log("Connected to database.");
    } catch (error) {
        console.log("Could not connect to database!", error);
    }
}