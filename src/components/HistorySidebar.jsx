import { useChatContext } from '../context/ChatContext';
import { useState, useEffect } from 'react';
export const HistorySidebar = () => {
    const { currentChatId, switchChat } = useChatContext();//从ChatContext中获取当前会话ID(currentChatId)和切换会话的方法(switchChat)
    // 从本地存储获取历史会话
    const [chats, setChats] = useState(() => {
        const storedChats = localStorage.getItem('chat_list');
        return storedChats ? JSON.parse(storedChats) : [
            { id: 'default', name: '默认会话' },
            { id: 'chat1', name: '会话1' }
        ];
    });
    // 1.新建会话（生成唯一ID(使用时间戳)，添加到列表并切换到该会话）
    const handleNewChat = () => {
        const newChat = { id: `chat${Date.now()}`, name: `新会话${chats.length + 1}` };
        const newChats = [...chats, newChat];//所有的会话
        setChats(newChats);//更新会话列表
        localStorage.setItem('chat_list', JSON.stringify(newChats));//将新会话列表保存到本地存储
        switchChat(newChat.id);//切换到新会话
    };
    // 2.删除会话（从列表中移除，若删除当前会话则切换到默认会话，同时删除对应的消息数据）
    const handleDeleteChat = (id, e) => {
        e.stopPropagation(); // 防止触发切换
        const newChats = chats.filter(chat => chat.id !== id);//从列表中移除指定会话
        setChats(newChats);//更新会话列表
        localStorage.setItem('chat_list', JSON.stringify(newChats));//将更新后的会话列表保存到本地存储
        // 若删除当前会话，切回默认
        if (id === currentChatId) switchChat('default');
        // 从本地删除对应会话的消息数据
        localStorage.removeItem(`chat_${id}`);
    };
    return (
        <div style={{ width: '200px', border: '1px solid #ccc', padding: '10px' }}>
            <h3>历史会话</h3>
            <button onClick={handleNewChat}>新建会话</button>
            <ul style={{ listStyle: 'none', padding: 0 }}>
                {chats.map(chat => (
                    <li
                        key={chat.id}
                        onClick={() => switchChat(chat.id)}
                        style={{
                            padding: '8px',
                            cursor: 'pointer',
                            backgroundColor: currentChatId === chat.id ? '#eee' : 'transparent'
                        }}
                    >
                        {chat.name}
                        <button onClick={(e) => handleDeleteChat(chat.id, e)}>×</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};