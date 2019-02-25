package com.wantao.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.wantao.mapper.MessageMapper;
import com.wantao.util.Message;

/**
 * @author wantao
 * @date 2019-02-14 12:25
 * @description: message表
 */
@Service
public class MessageService implements MessageMapper {
	@Autowired
	MessageMapper messageMapper;

	@Override
	public Integer selectMessageCount() {
		return messageMapper.selectMessageCount();
	}

	@Override
	public List<Message> selectAllMessage() {
		return messageMapper.selectAllMessage();
	}

	@Override
	public Integer deleteMessageByBatchById(List<Integer> ids) {
		return messageMapper.deleteMessageByBatchById(ids);
	}

}
