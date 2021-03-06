<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%
	pageContext.setAttribute("APP_PATH", request.getContextPath());
%>
<!DOCTYPE html>
<!--[if lt IE 7]>      <html class="no-js lt-ie9 lt-ie8 lt-ie7"> <![endif]-->
<!--[if IE 7]>         <html class="no-js lt-ie9 lt-ie8"> <![endif]-->
<!--[if IE 8]>         <html class="no-js lt-ie9"> <![endif]-->
<!--[if gt IE 8]><!-->
<html class="no-js">
<!--<![endif]-->
<head>
<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<title>register</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="description" content="Free HTML5 Template by FreeHTML5.co" />
<meta name="keywords"
	content="free html5, free template, free bootstrap, html5, css3, mobile first, responsive" />




<!-- Facebook and Twitter integration -->
<meta property="og:title" content="" />
<meta property="og:image" content="" />
<meta property="og:url" content="" />
<meta property="og:site_name" content="" />
<meta property="og:description" content="" />
<meta name="twitter:title" content="" />
<meta name="twitter:image" content="" />
<meta name="twitter:url" content="" />
<meta name="twitter:card" content="" />

<link rel="icon" href="${APP_PATH}/resource/image/logo.icon"
	type="image/x-icon" />

<link
	href='https://fonts.googleapis.com/css?family=Open+Sans:400,700,300'
	rel='stylesheet' type='text/css'>

<link rel="stylesheet"
	href="${APP_PATH}/resource/admin/template1/css/bootstrap.min.css">
<link rel="stylesheet"
	href="${APP_PATH}/resource/admin/template1/css/animate.css">
<link rel="stylesheet"
	href="${APP_PATH}/resource/admin/template1/css/style.css">

<!-- Modernizr JS -->
<script
	src="${APP_PATH}/resource/admin/template1/js/modernizr-2.6.2.min.js"></script>
<!-- FOR IE9 below -->
<!--[if lt IE 9]>
	<script src="${APP_PATH}/resource/admin/template1/js/respond.min.js"></script>
	<![endif]-->

</head>
<body class="style-2">

	<div class="container">
		<div class="row">
			<div class="col-md-4">


				<!-- Start Sign In Form -->
				<form action="#" class="fh5co-form animate-box"
					data-animate-effect="fadeInLeft">
					<h2>注册</h2>
					<div class="form-group">
						<label for="name" class="sr-only">姓名</label> <input type="text"
							class="form-control" id="name" placeholder="姓名"
							autocomplete="off">
					</div>
					<div class="form-group">
						<label for="email" class="sr-only">邮箱</label> <input
							type="email" class="form-control" id="邮箱" placeholder="邮箱"
							autocomplete="off">
					</div>
					<div class="form-group">
						<label for="password" class="sr-only">密码</label> <input
							type="password" class="form-control" id="password"
							placeholder="密码" autocomplete="off">
					</div>
					<div class="form-group">
						<label for="re-password" class="sr-only">重新输入密码</label>
						<input type="password" class="form-control" id="re-password"
							placeholder="重新输入密码" autocomplete="off">
					</div>
					<div class="form-group">
						<p>
							已经注册? <a href="${APP_PATH}/admin/login">登录</a>
						</p>
					</div>
					<div class="form-group">
						<input type="submit" value="注册" class="btn btn-primary">
					</div>
				</form>
				<!-- END Sign In Form -->


			</div>
		</div>
		<div class="row" style="padding-top: 60px; clear: both;">
			<div class="col-md-12 text-center">
				<p>
					<small>@上海电机学院 Selenium</small>
				</p>
			</div>
		</div>
	</div>

	<!-- jQuery -->
	<script src="${APP_PATH}/resource/admin/template1/js/jquery.min.js"></script>
	<!-- Bootstrap -->
	<script src="${APP_PATH}/resource/admin/template1/js/bootstrap.min.js"></script>
	<!-- Placeholder -->
	<script
		src="${APP_PATH}/resource/admin/template1/js/jquery.placeholder.min.js"></script>
	<!-- Waypoints -->
	<script
		src="${APP_PATH}/resource/admin/template1/js/jquery.waypoints.min.js"></script>
	<!-- Main JS -->
	<script src="${APP_PATH}/resource/admin/template1/js/main.js"></script>

</body>
</html>

