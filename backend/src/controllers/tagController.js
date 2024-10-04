// import db from '../models/index';

// const tagList = async (req, res) => {
//     try {
//         const tagList = await db.tags.findOne();

//         return res.status(200).json({
//             success: true,
//             data: tagList
//         });
//     } catch (error) {
//         console.error("Error loading tags list:", error);
//         return res.status(500).json({
//             success: false,
//             error: "An error has occurred while loading tags list, try again later!"
//         });
//     }
// }

// export default tagList;