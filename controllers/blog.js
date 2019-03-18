const Blog = require('../models/blogSchema');
const mongoose = require('mongoose');
const elasticClient = require('../elastic-search/connect-elastic');
const elastic = require('../elastic-search/test');

exports.createBlog = (req, res, next) => {
    const blog = new Blog({
      _id : new mongoose.Types.ObjectId,
      title : req.body.title,
      description : req.body.description,
    });
    blog.save((err, blog) => {
      if(err){
        console.log('Server Error save fun failed');
        res.status(500).json({
          msg : "Error occured on server side",
          err : err
        })
      }else{
		console.log(JSON.stringify(blog));
		elastic.index_Blog(blog, (err, result) => {
			if(err){
			  console.log('error' + JSON.stringify(err));
			}else{
				console.log('Success' + JSON.stringify(result));
				res.status(200).json({
					msg : "hey found the blog in do while",
					blog: {
						_id: result._id,
					}
				})
			  	//search Elastic Search for the indexed blog
				// let found = false;
				// let i = 1;
				// function fetchFromES () {
				// 	function callbackES(){
				// 		if (!found) {
				// 			console.log('Here in callback.');
				// 			return fetchFromES();
				// 		}
				// 		res.status(200).json({
				// 			msg : "hey found the blog in do while",
				// 			blog: {
				// 				_id: result._id,
				// 			}
				// 		})
				// 	};
				// 	elasticClient.search(
				// 		{
				// 			index : 'blog',
				// 			type : 'blog',
				// 			body: {
				// 				  query: {
				// 					match: { "_id": result._id }
				// 				}
				// 			}
				// 		}, (err, resul) => {
				// 			console.log('I am here!', i++);
				// 			if(err){
				// 					console.log(err);
				// 					res.status(500).json(err);
				// 					callbackES();
				// 			}else{
				// 				if(resul.hits.total >= 1){
				// 					found = true;
				// 				}
				// 				callbackES();
				// 			}  
				// 		}
				// 	);
				// }			
				//fetchFromES();
			}
		});
      }
    })
};
exports.editBlog = (req, res, next) => {
    console.log('here');
    Blog.findOneAndUpdate(
        {
            _id : req.body.blog_id,
        },
        {
            $set : {
                title : req.body.title,
                description : req.body.description 
            }
        }, 
        (err, blog) => {
            if(err){
                console.log('Blog.findOneAndUpdate Failed');
                res.status(500).json({
                    msg : err
                })
            }else{
							elastic.updateTheBlogInElasticSearch(blog._id, (err, result) => {
								if(err){
									console.log('Error ' + JSON.stringify(err));
								}else{
									console.log('Success ' + JSON.stringify(result));
									res.status(200).json({
										msg : "hey found the blog in do while",
										blog: {
											_id: result._id,
										}
									})
									// let found = false;
									// let i = 1;
									// function fetchFromES () {
									// 	function callbackES(){
									// 		if (!found) {
									// 			console.log('Here in callback.');
									// 			return fetchFromES();
									// 		}else{
									// 			res.status(200).json({
									// 				msg : "hey found the blog in do while",
									// 				blog: {
									// 					_id: result._id,
									// 				}
									// 			})
									// 		}
											
									// 	};
									// 	elasticClient.search(
									// 		{
									// 			index : 'blog',
									// 			type : 'blog',
									// 			body: {
									// 				query: {
									// 					match: { "_id": req.body.blog_id }
									// 				}
									// 			}
									// 		}, (err, resul) => {
									// 			console.log('I am here!', i++);
									// 			if(err){
									// 					console.log(err);
									// 					res.status(500).json(err);
									// 					callbackES();
									// 			}else{
									// 				if(resul.hits.total >= 1 && resul.hits.hits[0]._source.description == req.body.description &&		 resul.hits.hits[0]._source.title == req.body.title){
									// 					found = true;
									// 				}
									// 				callbackES();
									// 			}  
									// 		}
									// 	);
									// }			
									// fetchFromES();
										// res.status(200).json({
									// 	msg : " Successfullt updated",
									// 	blog : blog
									// })
								}
							});	  
            }
        }
    );
};
exports.getAllBlogs = (req, res, next) => {
  Blog.find()
    .populate({
      path :'comments',
      populate : { path : 'user_id', select : 'name'}
    })
    .exec((err, blogs) => {
      if(err){
        console.log('Error in populate');
        res.status(500).json({
          msg : err
        })
      }else{
        res.status(200).json({
          message : blogs  
        })
      }
    })
};
exports.getBlog = (req, res, next) => {
    Blog.findOne({ _id : req.params.blogId })
        .populate({
            path : 'comments',
            populate : {
                path : 'user_id',
                select : 'name'
            }
        })
        .exec((err, blog) => {
            if(err){
                res.status(500).json({
                    err : err
                })
            }else{
                res.status(200).json({
                    blog : blog
                })
            }
        })
};
exports.getAllElasticBlogs = (req, res, next) => {
  elasticClient.search({
	index : 'blog',
    size : 50
  }, (err, result, next) => {
    if(err){
      res.status(500).json(err);
    }else{
		changeESresultToMongoresult(result, (response) =>{
			res.status(200).json({
				message : response
			});
		})		
    }  
  });
};
exports.getElasticBlog = (req, res, next) => {
	elasticClient.search({
		index : 'blog',
		body: {
		  query: {
			match: { "id": req.params.blogId }
		  }
		}
	  }, (err, result, next) => {
		if(err){
		  res.status(500).json(err);
		}else{
			changeResultStructure(result, (response) =>{
				res.status(200).json({
					blog : response
				});								
			})
		}  
	})
};
function changeESresultToMongoresult(result, callback){
	let arr = [];
	result.hits.hits.forEach(element => {
		let blog_obj = {};
		blog_obj.comments = [];
		blog_obj.title = element._source.title;
		blog_obj.description = element._source.description;
		blog_obj._id = element._source.id;
		if (element._source.comments){
		element._source.comments.forEach( elastic_comment => {
			let cmnt_obj =  {};
			cmnt_obj.user_id = {};
			cmnt_obj.user_id.name = elastic_comment.name;
			cmnt_obj.description = elastic_comment.description;
			blog_obj.comments.push(cmnt_obj);
		});
		arr.push(blog_obj); 
	}
	});
	callback(arr);
};
function changeResultStructure(result ,callback){
	result.hits.hits.forEach(element => {
		let blog_obj = {};
		blog_obj.comments = [];
		blog_obj.title = element._source.title;
		blog_obj.description = element._source.description;
		blog_obj._id = element._source.id;
		element._source.comments.forEach( elastic_comment => {
			let cmnt_obj =  {};
			cmnt_obj.user_id = {};
			cmnt_obj.user_id.name = elastic_comment.name;
			cmnt_obj.description = elastic_comment.description;
			blog_obj.comments.push(cmnt_obj);
		});
		callback(blog_obj); 
	});
}; 










// do{
// 	elasticClient.search(
// 		{
// 			index : 'blog',
// 			body: {
// 				  query: {
// 					match: { "id": result._id }
// 				}
// 			}
// 		}, (err, resul, next) => {
// 			if(err){
// 					res.status(500).json(err);
// 			}else{
				
// 			}  
// 		}
// 	)
//   }while( found == true)