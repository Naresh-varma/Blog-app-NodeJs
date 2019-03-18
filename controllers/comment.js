const Blog = require('../models/blogSchema');
const Comment = require('../models/commentSchema');
const mongoose = require('mongoose');
const elastic = require('../elastic-search/test');
const elasticClient = require('../elastic-search/connect-elastic');


exports.createComment = (req, res, next) => {
    const comment = new Comment({
      _id : new mongoose.Types.ObjectId,
      user_id : req.data.user_id,
      blog_id : req.body.blog_id,
      description : req.body.description
    });
    comment.save((err, comment) => {
      if(err){
        console.log('Save method failed while saving a comment');
        res.status(500).json({
          msg : err
        })
      }else{
        ///save this comment id into Blog.comments[] array
        Blog.findOneAndUpdate(
          {
            _id : req.body.blog_id,
          },
          {
            $push : {
              comments : comment._id
            }
          }, 
          (err, blog) => {
            if(err){
              console.log('Blog.findOneAndUpdate Failed');
              res.status(500).json({
                msg : err
			  })
            }else{
				console.log(blog.comments);
				console.log('#########################',blog.comments);
				elastic.updateTheBlogInElasticSearch(req.body.blog_id, (err, result) => {
					if(err){
					  console.log('Error ' + JSON.stringify(err));
					}else{
						console.log('Success ' + JSON.stringify(result));
						res.status(200).json({
							msg : " Hey comment successfully saved into DB",
							comment : comment
						});	
					  // let reqCount = 1;
					  // function fetchfromES(){
						// elasticClient.search({
						// 	index : 'blog',
						// 	body: {
						// 	  query: {
						// 		match: { "id": req.body.blog_id }
						// 	  }
						// 	}
						//   }, (err, result) => {
						// 	if(err){
						// 	  res.status(500).json(err);
						// 	}else{
						// 		if(result.hits.total == 1){
						// 			// console.log('#################################',JSON.stringify(result));
						// 			console.log(`${reqCount++} checking with ES!`, result.hits.hits[0]._source.comments.length, blog.comments.length + 1);
						// 			if (result.hits.hits[0]._source.comments && result.hits.hits[0]._source.comments.length == blog.comments.length + 1) {	
						// 				res.status(200).json({
						// 					msg : " Hey comment successfully saved into DB",
						// 					comment : comment
						// 				});	
						// 			}else{
						// 				fetchfromES();
						// 			}
						// 		}
						// 	}  
						// })
					  // }
					  // fetchfromES();
					}
				});
			}
            // res.status(200).json({
            //   msg : " Hey comment successfully saved int DB",
            //   comment : comment
            // })
          }
        );    
      }
    })
}