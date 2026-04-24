require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/userdb";

mongoose
    .connect(MONGO_URI)
    .then(() => console.log("connected to mongodb"))
    .catch(err => console.log(err));


const userSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true,
        },
        lastName: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        gender: {
            type: String,
            required: true,
        },
        job_title: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

const User = mongoose.model("User", userSchema);

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get("/users", async (req, res) => {
    const users = await User.find();
    return res.status(200).send({ msg: "Users fetched successfully", users });
});
app.get("/users/:id", async (req, res) => {
    const id = req.params.id;
    const user = await User.findById(id);
    if (!user) {
        return res.status(404).send({ msg: "User not found" });
    }
    return res.status(200).send({ msg: "User fetched successfully", user });
});
app.get("/api/users", async (req, res) => {
    const alldbuser = await User.find();
    const html = `
    <ul>
    ${alldbuser.map(user => `<li>${user.firstName} ${user.lastName} - ${user.job_title}</li>`).join("")}
    </ul>
    `;
    return res.status(200).send(html);



});

app.post("/users", async (req, res) => {
    const body = req.body;
    if (!body || !body.first_name || !body.last_name || !body.email || !body.gender || !body.job_title) {
        return res.status(400).send({ msg: "Invalid request body" });
    }
    const result = await User.create({
        firstName: body.first_name,
        lastName: body.last_name,
        email: body.email,
        gender: body.gender,
        job_title: body.job_title
    });
    console.log(result);
    return res.status(201).send({ msg: "User created successfully", id: result._id });

});

app.listen(PORT, () => console.log(`server is running on port ${PORT}`));