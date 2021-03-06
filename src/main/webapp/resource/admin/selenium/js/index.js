/**
 * Author:Selenium
 */
var APP_PATH = $("#APP_PATH").val();
$(function() {
	// 查询未读联系人，未读评论，未读留言数量
	selectNotificationCount();
	// 获取用户数量
	getUserCount();
	//获取文章数量
	getArticleCount();
	//获取评论数量
	getCommentCount();
	//获取留言数量
	getMessageCount();
});

function getUserCount() {// 获取用户数量
	$.ajax({
		url : APP_PATH + "/admin/selectUserCount",
		type : "GET",
		success : function(result) {
			$("#user_progress").attr("style","width:"+result.data.count+"%; height: 4px;").attr("aria-valuenow",result.data.count);
			$("#user_count").text(result.data.count);
		}
	})
}

function getArticleCount(){// 获取文章数量
	$.ajax({
		url : APP_PATH + "/admin/selectArticleCount",
		type : "GET",
		success : function(result) {
			$("#article_progress").attr("style","width:"+result.data.count+"%; height: 4px;").attr("aria-valuenow",result.data.count);
			$("#article_count").text(result.data.count);
		}
	})
}

function getCommentCount(){// 获取评论数量
	$.ajax({
		url : APP_PATH + "/admin/selectCommentCount",
		type : "GET",
		success : function(result) {
			$("#comment_progress").attr("style","width:"+result.data.count+"%; height: 4px;").attr("aria-valuenow",result.data.count);
			$("#comment_count").text(result.data.count);
		}
	})
}

function getMessageCount(){// 获取留言数量
	$.ajax({
		url : APP_PATH + "/admin/selectMessageCount",
		type : "GET",
		success : function(result) {
			$("#message_progress").attr("style","width:"+result.data.count+"%; height: 4px;").attr("aria-valuenow",result.data.count);
			$("#message_count").text(result.data.count);
		}
	})
}

function selectNotificationCount() {// 查询未读联系人,未读信息，未读留言的数量
	$.ajax({
		url : APP_PATH + "/admin/selectNotificationCount",
		type : "get",
		success : function(result) {
			$("#new_contact_count").append(result.data.newContactCount);
			$("#new_message_count").append(result.data.newMessageCount);
			$("#new_comment_count").append(result.data.newCommentCount);
		}
	});
}