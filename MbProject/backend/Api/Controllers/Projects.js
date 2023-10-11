const Projects = require("../models/Projects");

//create Project

exports.createProject = async (req, res) => {
    const newProjects = new Projects(req.body);
  
    try {
      const savedProjects= await newProjects.save();
      res.status(200).json(savedProjects);
    } catch (err) {
      res.status(500).json(err);
    }
  };
//UPDATE
exports.updatedProject = async (req, res) => {
 

  try {
    const updatedProjects= await Projects.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedProjects);
  } catch (err) {
    res.status(500).json(err);
  }
};


//DELETE Projects
exports.deleteProjects =  async (req, res) => {
  try {
    await Projects.findByIdAndDelete(req.params.id);
    res.status(200).json("Project has been deleted...");
  } catch (err) {
    res.status(500).json(err);
  }
};

//GET Projects
exports.getProjectbyId= async (req, res) => {
  try {
    const Project = await Projects.findById(req.params.id);
    
    res.status(200).json(Project);
  } catch (err) {
    res.status(500).json(err);
  }
};

//GET ALL Projects
exports.getAllProjects= async (req, res) => {
  const query = req.query.new;
  try {
    const Project = query
      ? await Projects.find().sort({ _id: -1 }).limit(5)
      : await Projects.find();
    res.status(200).json(Project);
  } catch (err) {
    res.status(500).json(err);
  }
};

//GET Projects STATS

exports.getProjectsStatus= async (req, res) => {
  const date = new Date();
  const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));

  try {
    const data = await Projects.aggregate([
      { $match: { createdAt: { $gte: lastYear } } },
      {
        $project: {
          month: { $month: "$createdAt" },
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: 1 },
        },
      },
    ]);
    res.status(200).json(data)
    console.log(data);
  } catch (err) {
    res.status(500).json(err);
  }
};

