/**
 * Author:Selenium
 */
var APP_PATH = $("#APP_PATH").val();
$(function() {
	// 查询未读联系人，未读评论，未读留言数量
	selectNotificationCount();
	// 查询所有的评论并显示在分页中
	messages(1);
	// 为批量删除按钮绑定事件
	$("#batchDeleteButton").click(function() {
		deleteMessageByBatchById();
	});
	// 为批量已读按钮绑定事件
	$("#batchUpdateButton").click(function() {
		updateMessageByBatchById();
	});
	// 为全部已读按钮绑定事件
	$("#allUpdateButton").click(function() {
		updateAllMessage();
	});
	//为跳转任意页面按钮绑定事件
	$("#jumpButton").click(function(){
		var pn=$("#page_number").val();
		//记得要做校验
		messages(pn);
	});
});

function messages(pn) {// 查询所有的留言并显示在分页中
	$
			.ajax({
				url : APP_PATH + "/admin/selectAllMessage/" + pn,
				type : "GET",
				success : function(result) {
					var messages = result.data.pageInfo.list;
					$("#messages").empty();
					$
							.each(
									messages,
									function(index, item) {
										var tr = $("<tr></tr>");
										var checkbox = $("<td></td>")
												.append(
														$("<input type='checkbox' class='check_item' />"))
										var messageId = $("<td></td>").append(
												item.messageId);
										var messageUserName = $("<td></td>")
												.append(item.messageUserName);
										var messageContent = $("<td></td>")
												.append(item.messageContent);
										var messageCreateTime = $("<td></td>")
												.append(item.messageCreateTime);
										var messageIp=$("<td></td>").append(item.messageIp);
										var buttons = $("<td></td>");
										var deleteButton = $(
												"<button></button>").append(
												"删除").attr("class",
												"btn btn-danger").attr("id",
												"btn-delete-" + item.messageId);
										var answerButton = $("<button></button>").attr("id",
												"btn-answer-" + item.messageId);
										item.answer==1?answerButton.addClass("btn btn-success").append("已读"):answerButton.addClass("btn btn-default").append("未读")
										buttons.append(deleteButton).append(answerButton);
										tr.append(checkbox).append(messageId)
												.append(
														messageUserName)
												.append(messageContent).append(
														messageCreateTime).append(messageIp)
												.append(buttons).appendTo(
														$("#messages"));
										build_page_info(result);
										build_page_line(result);
										// 批量选择的选择框全选或者不全选
										selectCheckBox();
										// 为按钮绑定事件
										$("#btn-delete-" + item.messageId)
												.click(
														function() {
															var flag = confirm("是否删除id为:"
																	+ item.messageId
																	+ "的留言?");
															if (flag == true) {
																deleteMessageById(item.messageId);
															}
														});
										$("#btn-answer-" + item.messageId).click(function() {//单个未读已读
											var flag = confirm("是否已读id为:" + item.messageId + "的信息?");
											if (flag == true) {
												updateMessageById(item.messageId);
											}
										});
									});

				}
			});
}

function build_page_info(result) {// 构建分页信息
	$("#page_info").empty();// 注意每次构建前都要清空分页
	$("#page_info").append(
			"当前第" + result.data.pageInfo.pageNum + "页,共"
					+ result.data.pageInfo.pages + "页,共"
					+ result.data.pageInfo.total + "条记录")
}

function build_page_line(result) {// 构建分页条
	$("#page_line").empty();// 注意每次构建前都要清空分页
	var ul = $("<ul></ul>").addClass("pagination")
	// 首页
	firstPageLi = $("<li></li>").append(
			$("<a></a>").append("首页").attr("href", "#").addClass("page-link"))
			.addClass("page-item");
	// 前一页
	prePageLi = $("<li></li>").append(
			$("<a></a>").append("&laquo;").attr("href", "#").addClass(
					"page-link")).addClass("page-item");
	if (result.data.pageInfo.hasPreviousPage == false) {// 如果当前页是第一页,禁止点击
		firstPageLi.addClass("disabled");
		prePageLi.addClass("disabled");
	}
	firstPageLi.click(function() {// 跳转首页
		messages(1);
	});
	prePageLi.click(function() {// 跳转前一页(注意前面虽然禁止了首页跳转,但是只有禁止点击标志,还是可以点击)
		messages(result.data.pageInfo.pageNum == 1 ? 1
				: result.data.pageInfo.pageNum - 1)
	})
	ul.append(firstPageLi).append(prePageLi);
	// 下一页
	nextPageLi = $("<li></li>").append(
			$("<a></a>").append("&raquo;").attr("href", "#").addClass(
					"page-link")).addClass("page-item");
	// 末页
	lastPageLi = $("<li></li>").append(
			$("<a></a>").append("末页").attr("href", "#").addClass("page-link"))
			.addClass("page-item");
	if (result.data.pageInfo.hasNextPage == false) {// 如果当前页是最后一页禁止点击
		lastPageLi.addClass("disabled");
		nextPageLi.addClass("disabled");
	}
	lastPageLi.click(function() {// 跳转最后一页
		messages(result.data.pageInfo.pages);
	});
	nextPageLi
			.click(function() {// 跳转下一页(注意前面虽然禁止了末页跳转,但是只有禁止点击标志,还是可以点击,或者在pagehelper的配置中设置reasonable属性)
				messages(result.data.pageInfo.pageNum == result.data.pageInfo.pages ? result.data.pageInfo.pages
						: result.data.pageInfo.pageNum + 1)
			})
	$.each(result.data.pageInfo.navigatepageNums, function(index, item) {// 页数的生成与跳转
		var numLi = $("<li></li>").append(
				$("<a></a>").append(item).attr("href", "#").addClass(
						"page-link")).addClass("page-item");
		if (result.data.pageInfo.pageNum == item) {
			numLi.addClass("active");
		}
		numLi.click(function() {
			messages(item);
		})
		ul.append(numLi);
	})
	ul.append(nextPageLi).append(lastPageLi);
	var nav = $("<nav></nav>").append(ul).addClass();
	$("#page_line").append(nav).addClass("offset-md-7");
}

function selectCheckBox() {// 完成批量删除的checkbox全选or全不选
	$("#checkAll").prop("checked", null);
	$(".check_item")
			.click(
					function() {
						if ($("input[type=checkbox].check_item:checked").length == $(".check_item").length) {
							$("#checkAll").prop("checked", "checked");
						} else {
							$("#checkAll").prop("checked", null);
						}
					});
	$("#checkAll").click(function() {
		// 这里注意dom原生的属性使用prop,自定义属性使用attr
		// alert($(this).prop("checked"));
		$(".check_item").prop("checked", $(this).prop("checked"));
	});
}

function deleteMessageById(messageId) {// 删除单个
	$.ajax({
		url : APP_PATH + "/admin/deleteMessageById",
		type : "get",
		data : {
			"messageId" : messageId
		},
		success : function(result) {
			window.location.reload();
		}
	});
}

function deleteMessageByBatchById() {// 批量删除
	var messageId = "";
	var messageIdShow = "";
	$.each($(".check_item:checked"), function() {
		messageId += $(this).parents("tr").find("td:eq(1)").text() + "-";
		messageIdShow += $(this).parents("tr").find("td:eq(1)").text() + " ";
	});
	var flag = confirm("是否批量删除id为:" + messageIdShow + "的评论?");
	if (flag == true) {
		$.ajax({
			url : APP_PATH + "/admin/deleteMessageById",
			type : "get",
			data : {
				"messageId" : messageId
			},
			success : function(result) {
				window.location.reload();
			}
		});
	}
}
function updateMessageById(id) {// 修改单个
	$.ajax({
		url : APP_PATH + "/admin/updateMessageById",
		type : "get",
		data : {
			"id" : id
		},
		success : function(result) {
			window.location.reload();
		}
	});
}

function updateMessageByBatchById() {// 批量修改
	var id = "";
	var messageIdShow = "";
	$.each($(".check_item:checked"), function() {
		id += $(this).parents("tr").find("td:eq(1)").text() + "-";
		messageIdShow += $(this).parents("tr").find("td:eq(1)").text() + " ";
	});
	var flag = confirm("是否批量已读id为:" + messageIdShow + "的留言信息?");
	if (flag == true) {
		$.ajax({
			url : APP_PATH + "/admin/updateMessageById",
			type : "get",
			data : {
				"id" : id
			},
			success : function(result) {
				window.location.reload();
			}
		});
	}
}

function updateAllMessage(){//将全部信息设为已读
	var flag = confirm("是否将全部信息设为已读?");
	if(flag==true){
		$.ajax({
			url: APP_PATH + "/admin/updateAllMessage",
			type:"get",
			success:function(result){
				window.location.reload();
			}
		});
	}
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