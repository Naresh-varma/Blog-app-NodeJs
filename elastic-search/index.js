elasticClient = require('../elastic-search/connect-elastic');
let bulk = [];
const makebulk = (bloglist, callback) => {
  bloglist.forEach( (ele) => {
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
      //console.log(JSON.stringify(blog_details));
    bulk.push(  { index: {_index: 'blog', _type: 'blog', _id : ele._id} }, blog_details);
  })
    callback(bulk);
};
  
const indexall = (madebulk,callback) => {
  elasticClient.bulk({
    index: 'blog',
    type: 'blog',
    body: madebulk
  }, (err,resp,status) => {
      console.log('came here')
      if (err) {
        console.log(err);
      }
      else {
        callback("Hey index success" + JSON.stringify(resp.items[0]));
      }
  })
};


function addblogs(json) {  
    makebulk(json, (response) => {
        console.log("Bulk content prepared");
        indexall(response, function(response){
            console.log('Here' + response);
            searchAll();
        });
    });
}

exports.addblogs = addblogs;

function searchAll(){
  elasticClient.search({
    index : 'blog'
  }, (err, res, next) => {
    if(err)
      console.log(err);
    else
      console.log(res);
  })
}


