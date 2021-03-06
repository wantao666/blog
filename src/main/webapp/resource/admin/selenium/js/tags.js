/**
 * Author:Selenium
 */
var APP_PATH = $("#APP_PATH").val();
$(function() {
	// 查询未读联系人，未读评论，未读留言数量
	selectNotificationCount();
	// 查询所有的文章并显示在分页中
	tags(1);
	// 为修改按钮绑定事件
	$("#updateButton").click(function() {
		update($(this));
	});
	// 为批量删除按钮绑定事件
	$("#batchDeleteButton").click(function() {
		deleteTagByBatchById();
	});
	// 为新增按钮绑定事件
	$("#addButton").click(function() {
		add();
	});
	// 为跳转任意页面按钮绑定事件
	$("#jumpButton").click(function() {
		var pn = $("#page_number").val();
		// 记得要做校验
		tags(pn);
	});
});

function tags(pn) {// 查询所有的标签并显示在分页中
	$
			.ajax({
				url : APP_PATH + "/admin/selectAllTag/" + pn,
				type : "GET",
				success : function(result) {
					var tags = result.data.pageInfo.list;
					$("#tags").empty();
					$
							.each(
									tags,
									function(index, item) {
										var tr = $("<tr></tr>");
										var checkbox = $("<td></td>")
												.append(
														$("<input type='checkbox' class='check_item' />"))
										var tagId = $("<td></td>").append(
												item.tagId);
										var tagName = $("<td></td>").append(
												item.tagName);
										var tagImage = $("<td></td>")
												.append(
														$("<img></img>")
																.prop(
																		"src",
																		item.tagImage == null ? APP_PATH
																				+ '/resource/tag/language.jpg'
																				: APP_PATH
																						+ item.tagImage)
																.addClass(
																		"rounded-circle")
																.prop("height",
																		50));
										var tagDescription = $("<td></td>")
												.append(item.tagDescription);
										var buttons = $("<td></td>");
										var updateButton = $(
												"<button></button>").append(
												"修改").attr("class",
												"btn btn-success").attr("id",
												"btn-update-" + item.tagId);
										var deleteButton = $(
												"<button></button>").append(
												"删除").attr("class",
												"btn btn-danger").attr("id",
												"btn-delete-" + item.tagId);
										buttons.append(updateButton)
												.append(" ").append(
														deleteButton);
										tr.append(checkbox).append(tagId)
												.append(tagName).append(
														tagImage).append(
														tagDescription).append(
														buttons).appendTo(
														$("#tags"));
										build_page_info(result);
										build_page_line(result);
										// 批量选择的选择框全选或者不全选
										selectCheckBox();
										// 为按钮绑定事件
										$("#btn-update-" + item.tagId)
												.click(
														function() {
															build_update_modal(item.tagId);
														});
										$("#btn-delete-" + item.tagId)
												.click(
														function() {
															var flag = confirm("是否删除标签'"
																	+ item.tagName
																	+ "'?");
															if (flag == true) {
																deleteTagById(item.tagId);
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
		tags(1);
	});
	prePageLi.click(function() {// 跳转前一页(注意前面虽然禁止了首页跳转,但是只有禁止点击标志,还是可以点击)
		tags(result.data.pageInfo.pageNum == 1 ? 1
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
		tags(result.data.pageInfo.pages);
	});
	nextPageLi
			.click(function() {// 跳转下一页(注意前面虽然禁止了末页跳转,但是只有禁止点击标志,还是可以点击,或者在pagehelper的配置中设置reasonable属性)
				tags(result.data.pageInfo.pageNum == result.data.pageInfo.pages ? result.data.pageInfo.pages
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
			tags(item);
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

function build_update_modal(tagId) { // 构建修改模态框
	$.ajax({
		url : APP_PATH + "/admin/selectTagById/" + tagId,
		type : "GET",
		success : function(result) {
			$(".u").empty();
			$("#updateForm")[0].reset();
			var tag = result.data.tag;
			$("#tagId").text(tag.tagId);
			$("#tagName").val(tag.tagName);
			tag.tagImage == null ? $("#tagImage").prop("src",
					APP_PATH + "/resource/tag/language.jpg").addClass(
					"rounded-circle").prop("height", 50) : $("#tagImage").prop(
					"src", APP_PATH + "" + tag.tagImage).addClass(
					"rounded-circle").prop("height", 50);
			$("#photo").change(function() {// ajax实时显示上传的照片
				showImgOnTime();
			});
			$("#tagDescription").val(tag.tagDescription);
			$("#updateButton").attr("update-id", tag.tagId);
			$('#myUpdateModal').modal({});
		}
	});
}

function update(button) {// 修改标签
	var formData = new FormData($("#updateForm")[0]);
	formData.append("file", $("#photo")[0]);// ajax文件上传
	formData.append("tagId", button.attr("update-id"));
	$.ajax({
		url : APP_PATH + "/admin/updateTagById",
		type : "POST",
		data : formData,
		cache : false,
		contentType : false,
		processData : false,
		success : function(result) {
			$('#myUpdateModal').modal('hide');
			window.location.reload();
		}
	});
}

function deleteTagById(tagId) {// 删除单个
	$.ajax({
		url : APP_PATH + "/admin/deleteTagById",
		type : "get",
		data : {
			"tagId" : tagId
		},
		success : function(result) {
			window.location.reload();
		}
	});
}

function deleteTagByBatchById() {// 批量删除
	var tagId = "";
	var tagName = "";
	$.each($(".check_item:checked"), function() {
		tagId += $(this).parents("tr").find("td:eq(1)").text() + "-";
		tagName += "'" + $(this).parents("tr").find("td:eq(2)").text() + "' ";
	});
	tagName = tagName.substring(0, tagName.length - 1);
	var flag = confirm("是否删除标签名为" + tagName + "的标签?");
	if (flag == true) {
		$.ajax({
			url : APP_PATH + "/admin/deleteTagById",
			type : "get",
			data : {
				"tagId" : tagId
			},
			success : function(result) {
				window.location.reload();
			}
		});
	}
}

function add() {// 增加新标签
	$("#addForm")[0].reset();
	$(".a").empty();
	$('#myAddModal').modal({});
	$("#photo1").change(function() {// ajax实时显示上传的照片
		showImgOnTime1();
	});
	$("#addButtonFinish").click(function() {
		var formData = new FormData($("#addForm")[0]);
		formData.append("file", $("#photo1")[0]);// ajax文件上传
		$.ajax({
			url : APP_PATH + "/admin/addTag",
			type : "post",
			data : formData,
			cache : false,
			contentType : false,
			processData : false,
			success : function(result) {
				$('#myAddModal').modal('hide');
				window.location.reload();
			}
		});
	});
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
function showImgOnTime1() { // add时发送ajax请求实时显示上传的照片
	var formData = new FormData($("#addForm")[0]);
	formData.append("file", $("#photo1")[0]);// ajax文件上传
	$.ajax({
		url : APP_PATH + "/admin/showImgOnTime1",
		type : "post",
		data : formData,
		cache : false,
		contentType : false,
		processData : false,
		success : function(result) {
			$("#tagImage1").prop("src", APP_PATH + result.data.imgUrl)
					.addClass("rounded-circle").prop("height", 50);
		}

	});
}

function showImgOnTime() { // 修改时发送ajax请求实时显示上传的照片
	var formData = new FormData($("#updateForm")[0]);
	formData.append("file", $("#photo")[0]);// ajax文件上传
	$.ajax({
		url : APP_PATH + "/admin/showImgOnTime1",
		type : "post",
		data : formData,
		cache : false,
		contentType : false,
		processData : false,
		success : function(result) {
			$("#tagImage").prop("src", APP_PATH + result.data.imgUrl).addClass(
					"rounded-circle").prop("height", 50);
		}

	});
}