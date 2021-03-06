/**
 * author:Selenium
 */
var ARTICLE_ID = $("#ARTICLE_ID").val();
var APP_PATH = $("#APP_PATH").val();
$(function() {
	show();
	my_time();
	// 为评论提交按钮绑定事件
	$("#comment_submit_button").click(function() {
		add_comment($(this).attr("send_id"));
		return false;
	});
	$("#find").click(function(){
		var content=$("#article_content").text();
		var keyword=$("#ky").val();
		if(content.indexOf(keyword)<0){//没有找到
			alert("文章内没找到您查找的值，换个关键字试试吧");
			window.location.reload();
		}else{
			find();	
		}
		return false;
	});
})

function show() {
	$.ajax({
		url : APP_PATH + "/user/selectArticleById",
		type : "get",
		data : {
			"articleId" : ARTICLE_ID,
		},
		success : function(result) {
			var article = result.data.article;
			var category = result.data.category;
			var tags = result.data.tags;
			var relateArticles = result.data.relateArticles;
			$("#article_title").append(article.articleTitle);
			// 构建文章
			$("#article_time").append(article.articleCreateTime).attr({
				"data-original-title" : article.articleCreateTime
			});
			$("#article_author").append(article.articleUserName).attr({
				"data-original-title" : article.articleUserName
			});
			$("#article_category").append(category.categoryName).attr(
					"data-original-title", category.categoryName);
			$("#article_view_count").append(article.articleViewCount).attr(
					"data-original-title", article.articleViewCount);
			$("#article_comment_count").append(article.articleCommentCount)
					.attr("data-original-title", article.articleCommentCount);
			$("#article_content").append(article.articleContent);
			$("#comment_submit_button").attr("send_id", article.articleId);
			show_comment($("#comment_submit_button").attr("send_id"));
			// 构建文章标签
			var tagString = "标签: ";
			$("#tagDiv").append(tagString);
			$.each(tags, function(index, item) {
				var tag = $("<a></a>").attr({
					"rel" : "tag",
					"draggable" : "false"
				}).append(item.tagName).appendTo($("#tagDiv"));
			});
			// 构建文章推荐
			var recommend = $("#relate_recommend");
			var flag=$.isEmptyObject(relateArticles);
			if(flag==false){
			$.each(relateArticles, function(index, item) {
				recommend.append($("<li></li>").append(
						$("<a></a>").prop("href",
								APP_PATH + "/user/article/" + item.articleId)
								.append(item.articleTitle))).append($("<br/>"));
			})}else{
				recommend.append($("<li style='color:red'></li>").append("此分类暂无文章推荐")).append($("<br/>"));
			}

		}
	});
}

function show_comment(articleId) {
	$.ajax({
		url : APP_PATH + "/user/selectCommentsByArticleId",
		type : "get",
		data : {
			"articleId" : articleId,
		},
		success : function(result) {
			var comments=result.data.comments;
			var flag=$.isEmptyObject(comments);
			if(flag==false){
			var count=1;
			$.each(comments,function(index,item){
				number=$("<li></li>").addClass("comment-content").append($("<span></span>").addClass("comment-f").append("#"+count));
				commentDiv=$("<div></div>").addClass("comment-main");
				commentDiv.append($("<p style='color:blue;font-size:30px;'></p>").append($("<a class='address' rel='nofollow'></a>")).append(item.commentUserName).append($("<span style='color:red;'></span>").addClass("time").append(item.commentCreateTime).append($("<br>")).append($("<p style='color:black;font-size:20px;'></p>").append(item.commentContent))));
				$("#comment_list").append(number).append(commentDiv);
				++count;
			});
			}else{
				$("#comment_list").append($("<li></li>").addClass("comment-content")).append($("<br/>")).append($("<li style='color:red'></li>").append("暂无评论，期待您的评论"));
			}
		}
	});
}

function add_comment(articleId) {
   $.ajax({
	   url:APP_PATH+"/user/addComment",
	   type:"post",
	   data:$("#comment_form").serialize()+"&commentArticleId="+articleId,
	   success:function(result){
		   $(".a").empty();
		   $("#comment_form")[0].reset();
		   alert("您已成功添加评论!!!");
		   window.location.reload();
	   }
   });
}

function my_time(){
	// 获取当前时间时间戳
	var currentTime = Date.now(); 
	// 获取指定时间时间戳
	// 注1：这里写的是2019年3月1日0时0分0秒
	// 注2：Javascript中月份是实际数字减1
	var targetTime = (new Date(2019, 2, 1, 0, 0, 0)).getTime();
	// 获取差值，如果指定日期早于现在，则为负数
	var offsetTime = targetTime - currentTime;
    // 求绝对值，获取相差的时间
	offsetTime = Math.abs(offsetTime);
	// 将时间转位天数
	// 注：Javascript中时间戳的单位是毫秒
	var offsetDays = Math.floor(offsetTime / (3600 * 24 * 1e3));
	$("#my_time").text(offsetDays);
}

var old_content=null;
var count =1;
function find(){
	    if(old_content==null){
	    	var content=$("#article_content").html();
	    	if(count==1){
	    	old_content=content; 
	    	}  
	    }else{
	    	content=old_content;
	    }
	    var keyword=$("#ky").val();
    	re = new RegExp(keyword+"","g"); //定义正则表达式
    	var newstr=content.replace(re,"<b style='color:red'>"+keyword+"</b>"); 
    	//第一个参数是正则表达式。
		$("#article_content").empty();
		$("#article_content").append(newstr);
}