package com.wantao.controller;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.wantao.bean.Article;
import com.wantao.bean.Category;
import com.wantao.bean.Comment;
import com.wantao.bean.Contact;
import com.wantao.bean.Me;
import com.wantao.bean.Tag;
import com.wantao.service.ArticleCategoryRefService;
import com.wantao.service.ArticleService;
import com.wantao.service.ArticleTagRefService;
import com.wantao.service.CategoryService;
import com.wantao.service.CommentService;
import com.wantao.service.ContactService;
import com.wantao.service.MeService;
import com.wantao.service.MessageService;
import com.wantao.util.HtmlUtil;
import com.wantao.util.Message;

/**
 * @author wantao
 * @date 2019-02-13 23:02
 * @description: 控制前台逻辑
 */
@Controller
@RequestMapping("/user")
public class UserController {
	@Autowired
	MeService meService;
	@Autowired
	ContactService contactService;
	@Autowired
	ArticleService articleService;
	@Autowired
	ArticleCategoryRefService articleCategoryRefService;
	@Autowired
	ArticleTagRefService articleTagRefService;
	@Autowired
	CommentService commentService;
	@Autowired
	MessageService messageService;
	@Autowired
	HtmlUtil htmlUtil;
	@Autowired
	CategoryService categoryService;
	private static final Logger logger = LoggerFactory.getLogger("UserController.class");

	@RequestMapping("/404")
	public String error_404() {
		return "user/404" ;	
    }
	
	/**
	 * @param
	 * @return String
	 * @description 跳转首页
	 */
	@RequestMapping("/index")
	public String index() {
		return "user/index";
	}

	/**
	 * @param
	 * @return String
	 * @description 跳转个人信息页面
	 */
	@RequestMapping("/aboutMe")
	public String aboutMe() {
		return "user/me";
	}

	/**
	 * @param
	 * @return String
	 * @description 跳转博客文章页面
	 */
	@RequestMapping("/blog")
	public String blog() {
		return "user/blog";
	}
	
	/**
	 * @param
	 * @return String
	 * @description 跳转留言页面
	 */
	@RequestMapping("/message")
	public String message() {
		return "user/message";
	}
	

	@GetMapping("/article/{pn}")
	public String article(Model model, @PathVariable("pn") Integer pn) {
		model.addAttribute("ARTICLE_ID", pn);
		return "user/article";
	}

	/**
	 * @param
	 * @return Message
	 * @description 查询个人信息
	 */
	@GetMapping("/selectMe")
	@ResponseBody
	public Message selectMe() {
		Me me = meService.selectMe();
		return Message.success().add("me", me);
	}

	/**
	 * @param
	 * @return 
	 * @description 增加联系人
	 */
	@PostMapping("/addContact")
	public String addContact(Contact contact, HttpServletRequest request) {
		contact.setSendTime(new SimpleDateFormat("yyyy-MM-dd  HH:mm:ss").format(new Date()));
		contact.setSendIp(request.getRemoteAddr());
		// logger.info("进入到表单提交的方法");
		contact.setAnswer(0);
		contactService.addContact(contact);
		return "user/me";
	}

	/**
	 * @param
	 * @return Message
	 * @description 查询有效文章列表
	 */
	@GetMapping("/selectArticle/{pn}")
	@ResponseBody
	public Message selectAllArticle(@RequestParam(name = "categoryId", required = false, defaultValue = "0") Integer categoryId,@PathVariable("pn") Integer pn) {
		PageInfo pageInfo=null;
		List<Article> articles=null;
		if(categoryId==0) {
		PageHelper.startPage(pn, 7);// 后面紧跟的查询为分页查询
		articles = articleService.selectAllArticleWithStatus();
		pageInfo = new PageInfo(articles, 7);// 用pageInfo封装然后交给页面
		return Message.success().add("pageInfo", pageInfo).add("categoryId",categoryId);
		}else {
		PageHelper.startPage(pn, 7);
		articles=articleCategoryRefService.selectArticleByCategoryId(categoryId);
		pageInfo = new PageInfo(articles, 7);
		return  Message.success().add("pageInfo", pageInfo).add("categoryId",categoryId);
		}
	}

	/**
	 * @param
	 * @return Message
	 * @description 根据id查询文章和文章所属分类
	 */
	@GetMapping("/selectArticleById")
	@ResponseBody
	public Message selectArticleById(@RequestParam("articleId") Integer articleId) {
		Article article = articleService.selectArticleByIdWithStatus(articleId);
		Category category = articleCategoryRefService.selectCategoryByArticleId(articleId);
		List<Article> relateArticles = articleTagRefService.selectRelateArticle(articleId);
		List<Tag> tags = articleTagRefService.selectTagByArticleId(articleId);
		return Message.success().add("article", article).add("category", category).add("tags", tags)
				.add("relateArticles", relateArticles);
	}
	
	@PostMapping("/selectArticleByKeyword/{pn}")
	@ResponseBody
	public Message selectArticleByKeyword(@RequestParam("ky")String ky,@PathVariable("pn")Integer pn) {
		String keyword=htmlUtil.htmlFilter(ky);
		PageHelper.startPage(pn, 7);
		List<Article>kyArticles=articleService.selectArticleByKeyword(keyword);
		PageInfo pageInfo = new PageInfo(kyArticles, 7);
		return Message.success().add("pageInfo",pageInfo);
	}
	
	
	
	/**
	 * @param
	 * @return 
	 * @description 增加评论
	 */
	@PostMapping("/addComment")
	@ResponseBody
	public Message addComment(Comment comment, HttpServletRequest request) {
		//logger.info(comment.toString());
		comment.setCommentCreateTime(new SimpleDateFormat("yyyy-MM-dd  HH:mm:ss").format(new Date()));
		comment.setCommentIp(request.getRemoteAddr());
		comment.setAnswer(0);
		String commentContent=htmlUtil.htmlFilter(comment.getCommentContent());
		String commentUserName=htmlUtil.htmlFilter(comment.getCommentUserName());
		String commentUserEmail=htmlUtil.htmlFilter(comment.getCommentUserEmail());
		comment.setCommentContent(commentContent);
		comment.setCommentUserName(commentUserName);
		comment.setCommentUserEmail(commentUserEmail);
		commentService.insertComment(comment);
		return Message.success();
	}
	
	@GetMapping("/selectCommentsByArticleId")
	@ResponseBody
	public Message selectCommentsByArticleId(@RequestParam("articleId")Integer articleId) {
		List<Comment> comments=commentService.selectCommentsByArticleId(articleId);
		return Message.success().add("comments",comments);
	}
	
	@GetMapping("/selectAllMessage/{pn}")
	@ResponseBody
	public Message selectAllMessage(@PathVariable("pn")Integer pn) {
		PageHelper.startPage(pn, 5);// 后面紧跟的查询为分页查询
		List<com.wantao.bean.Message> messages=messageService.selectAllMessage();
		PageInfo pageInfo = new PageInfo(messages, 5);// 用pageInfo封装然后交给页面
		return Message.success().add("pageInfo", pageInfo);
	}
	
	/**
	 * @param
	 * @return 
	 * @description 增加留言
	 */
	@PostMapping("/addMessage")
	@ResponseBody
	public Message addMessage(com.wantao.bean.Message message, HttpServletRequest request) {
		//logger.info(comment.toString());
		message.setAnswer(0);
		message.setMessageCreateTime(new SimpleDateFormat("yyyy-MM-dd  HH:mm:ss").format(new Date()));
		message.setMessageIp(request.getRemoteAddr());
		String messageUserName=htmlUtil.htmlFilter(message.getMessageUserName());
		String messageContent=htmlUtil.htmlFilter(message.getMessageContent());
		message.setMessageUserName(messageUserName);
		message.setMessageContent(messageContent);
		messageService.insertMessage(message);
		return Message.success();
	}
	
	/**  
	* @method: selectAllCategoryIdAndName   
	* @param @return     
	* @return Message    
	* @throws  
	* @description: 查询所有的分类id和name
	*/
	@GetMapping("/selectAllCategoryIdAndName")
	@ResponseBody
	public Message selectAllCategoryIdAndName() {
		List<Map<String,Object>>categoryIdAndName=categoryService.selectAllCategoryIdAndName();
		return Message.success().add("categoryIdAndName",categoryIdAndName);
	}
	@GetMapping("/selectMostArticleCategory4")
	@ResponseBody
	public Message selectMostArticleCategory4() {
		List<Category>categorys=articleCategoryRefService.selectMostArticleCategory4();
		return Message.success().add("categorys",categorys);
	}
}
