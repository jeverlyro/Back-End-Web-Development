const express = require("express");
const path = require("path");
const multer = require("multer");
const client = require("./mongodb")

// Configure multer storage with more options
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

// Add file filter to control what files can be uploaded
const fileFilter = (req, file, cb) => {
  // Accept all files for now - you can add restrictions if needed
  cb(null, true);
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 5 // 5MB file size limit
  }
});

const routers = express.Router();

// Routing
routers.get("/users", async (req, res) => {
  try {
    const db = client.db("latihan");
    const users = await db.collection("users").find().toArray();
    res.json({
      status: "success",
      message: "Users data",
      data: users,
    })
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error fetching users: " + error.message,
    });
  }
})

// Post User
routers.post("/users", async (req, res) => {
  try {
    const db = client.db("latihan");
    const { name, age, status } = req.body;
    const newUser = { name, age, status };
    
    const result = await db.collection("users").insertOne(newUser);
    
    res.status(201).json({
      status: "success",
      message: "User created successfully",
      data: {
        id: result.insertedId,
        ...newUser,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error creating user: " + error.message,
    });
  }
});

// Update User
routers.put("/users/:id", async (req, res) => {
  try {
    const db = client.db("latihan");
    const { ObjectId } = require("mongodb");
    
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        status: "error",
        message: "Invalid user ID format"
      });
    }

    const { name, age, status } = req.body;
    const updatedUser = { name, age, status };
    
    const result = await db.collection("users").updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: updatedUser }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({
        status: "error",
        message: "User not found"
      });
    }

    res.json({
      status: "success",
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error updating user: " + error.message,
    });
  }
});

// Delete User
routers.delete("/users/:id", async (req, res) => {
  try {
    const db = client.db("latihan");
    const { ObjectId } = require("mongodb");
    
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        status: "error",
        message: "Invalid user ID format"
      });
    }

    const result = await db.collection("users").deleteOne({
      _id: new ObjectId(req.params.id)
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        status: "error",
        message: "User not found"
      });
    }

    res.json({
      status: "success",
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error deleting user: " + error.message,
    });
  }
});

// Get order user
routers.get("/users/order/:order", async (req, res) => {
  try {
    const db = client.db("latihan");
    const order = req.params.order === "asc" ? 1 : -1;
    const users = await db.collection("users").find().sort({ name: order }).toArray();
    
    res.json({
      status: "success",
      message: "Users sorted by name",
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error fetching users: " + error.message,
    });
  }
});

// Get User by ID
routers.get("/users/:id", async (req, res) => {
  try {
    const db = client.db("latihan");
    const { ObjectId } = require("mongodb");
    
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        status: "error",
        message: "Invalid user ID format"
      });
    }

    const user = await db.collection("users").findOne({
      _id: new ObjectId(req.params.id)
    });

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found"
      });
    }

    res.json({
      status: "success",
      message: "User found",
      data: user
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error fetching user: " + error.message,
    });
  }
});

routers.get("/download", (req, res) => {
  const filename = "/growellfavicon.png";
  res.download(path.join(__dirname, filename), "logo.png");
});

routers.post("/upload", upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        status: "error",
        message: "No file was uploaded. Please select a file."
      });
    }
    
    // If we get here, file was successfully uploaded
    return res.status(200).json({
      status: "success",
      message: "File berhasil diupload",
      data: {
        filename: req.file.filename,
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        path: req.file.path
      }
    });
  } catch (error) {
    console.error("File upload error:", error);
    return res.status(500).json({
      status: "error",
      message: "Error uploading file: " + error.message
    });
  }
});

routers.post("/login", (req, res) => {
  const { username, password } = req.body;
  res.status(200).json({
    status: "success",
    message: "Login page",
    data: {
      username: username,
      password: password,
    },
  });
});
routers.get("/", (req, res) => res.send("Hello World"));
routers.get("/about", (req, res) =>
  res.status(200).json({
    status: "success",
    message: "About page",
    data: [],
  })
);

routers.put("/about", (req, res) =>
  res.status(200).json({
    status: "success",
    message: "About page",
    data: [],
  })
);

routers.post("/contoh", (req, res) => res.send("request method POST"));
routers.put("/contoh", (req, res) => res.send("Request method PUT"));
routers.delete("/contoh", (req, res) => res.send("Request method DELETE"));
routers.patch("/contoh", (req, res) => res.send("Request method PATCH"));

routers.all("/universal", (req, res) =>
  res.send(`Request method ${req.method}`)
);
// Routing dinamis
// 1. Menggunakan params
routers.get("/post/:id", (req, res) =>
  res.send(`Artikel ke - ${req.params.id}`)
);
// 2. Menggunakan Query String
routers.get("/post", (req, res) => {
  const { page, sort } = req.query;
  res.send(`Query string= page :${page}, sort : ${sort}`);
});

module.exports = routers;