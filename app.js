const express = require("express");
const session = require("express-session");
const app = express();
const port = 3000;
const passport = require("./src/configs/passportConfig");
const upload = require("./src/controllers/fileUploadController");
const getfiles = require("./src/controllers/fileManageController");

app.set("view engine", "ejs");
app.use(
    session({
        secret: "secret",
        resave: false,
        saveUninitialized: false,
    })
);
app.use(passport.initialize());
app.use(passport.session());

const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
};

//AUTHENTICATION
app.get(
    "/auth/google",
    passport.authenticate("google", { scope: ["profile"] })
);

app.get("/login", (req, res) => {
    res.render("login");
});
app.get('/home', (req, res) => {
    res.render("home");
});
app.get(
    "/auth/google/callback",
    passport.authenticate("google", { failureRedirect: "/login" }),
    function (req, res) {
        // Successful authentication, redirect home.
        res.redirect("/files");
    }
);
app.post("/upload", isAuthenticated, upload.single("fileUpload"), upload.fileHandler, (req, res) => {
    res.send("File uploaded successfully");
});

app.get("/files", isAuthenticated, (req, res) => {
    getfiles.getFiles(req.user.id)
        .then(files => {
            res.render("home", { files: files });
            // console.log(files);
        })
        .catch(err => {
            console.log(err);
            res.status(500).send("Internal Server Error");
        });

});

app.post("/files/rename/:id", (req, res) => {
    const id = req.params.id;
    const newName = req.body.newName;
    getfiles.renameFile(id, newName)
        .then(file => {
            res.redirect("/files");
        }
        )
        .catch(err => {
            console.log(err);
            res.status(500).send("Internal Server Error");
        }
        );
});

app.delete("/files/delete/:id", (req, res) => {
    const id = req.params.id;
    getfiles
    .deleteFile(req.user.id, id)
    .then(success => {
      if (success) {
        res.sendStatus(200); // Send a 200 status code for a successful deletion
      } else {
        res.sendStatus(404); // Send a 404 status code if the file is not found or already deleted
      }
    })
    .catch(err => {
      console.log(err);
      res.sendStatus(500); // Send a 500 status code for internal server errors
    });
});


// app.get("/profile", async (req, res) => {
//     if (req.isAuthenticated()) {
//         try {
//             const user = await req.user.id;
//             console.log(user);
//             res.send(`Username: ${user}`);
//         } catch (error) {
//             console.log("Error retrieving user:", error);
//             res.status(500).send("Internal Server Error");
//         }
//     } else {
//         console.log("Not logged in");
//         res.redirect("/login"); // Redirect to login page or handle as desired
//     }
// });


app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
