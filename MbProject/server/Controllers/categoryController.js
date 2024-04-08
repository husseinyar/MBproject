
import CombinedModel from '../Models/CombinedModel.js'
// GET route to fetch projects for a specific year
export const year = async (req, res)=> {

      console.log(req.params.year)

      try {
        const year = parseInt(req.params.year);
    
        // Find projects with construction start date within the specified year
        const projects = await CombinedModel.find({
          'project.constructionStartdate': { $regex: `^${year}` }
        });
    
        res.status(200).json({ projects });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
      }
    }
// GET route to fetch projects for a specific year and month

export const months = async (req, res)=> {
  console.log(req.params.year)
  console.log(req.params.month)

  try {
    const year = parseInt(req.params.year);
    const month = parseInt(req.params.month);

    // Format month with leading zero if needed (e.g., '01' for January)
    const formattedMonth = month < 10 ? `0${month}` : `${month}`;

    // Find projects with construction start date within the specified year and month
    const projects = await CombinedModel.find({
      'project.constructionStartdate': { $regex: `^${year}-${formattedMonth}` }
    });

    res.status(200).json({ projects });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

