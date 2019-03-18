const elasticClient = require('../elastic-search/connect-elastic');
const Blog = require('../models/blogSchema');
function index_Blog(ele, callback){
	console.log('from index_blog');
	console.log(ele);
    let blog_details = {};
    blog_details.description = ele.description;
    blog_details.title = ele.title;
    blog_details.id = ele._id;
    blog_details.comments = [];
    ele.comments.forEach(element => {
      	//console.log(JSON.stringify(element));
      	let commennt = {};
    	commennt.name = element.user_id.name;
      	commennt.description = element.description;
      	blog_details.comments.push(commennt);
	});
	console.log(typeof ele._id);
	 elasticClient.index(
		{
			index : 'blog',
			type : 'blog',
			id : String(ele._id),
			body : blog_details,
			refresh: 'wait_for',
		},
		(err, res, next) => {
			if(err)
				callback(err);
			else
				callback(null, res);
		}
	);
	
}

function populateTheBlog(blogId, callback){
	console.log('POpulating blogId: ' + blogId);
	Blog.findOne({ _id : blogId })
        .populate({
            path : 'comments',
            populate : {
                path : 'user_id',
                select : 'name'
            }
        })
        .exec((err, blog) => {
            if(err){
                callback(err);
            }else{
				console.log('Populated this blog ' + JSON.stringify(blog));
                callback(null, blog);
            }
        })
}

function updateTheBlogInElasticSearch(blogId, callback){
	console.log('Populating blogId:' + blogId);
	populateTheBlog(blogId, (err, blog) => {
		if(err){
			//console.log('populate funcion failed');
			callback(err);
		}else{
			index_Blog(blog, (err, result) => {
				if(err){
					//console.log('indexing failed' + JSON.stringify(result));
					callback(err);
				}else{
					//console.log('Indexing success' + JSON.stringify(result));
					callback(null, result);
				}
			})
		}
	})
}

exports.updateTheBlogInElasticSearch = updateTheBlogInElasticSearch;
exports.index_Blog = index_Blog;
