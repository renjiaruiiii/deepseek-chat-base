import { useChatContext } from '../context/ChatContext';
import { useState } from 'react';
export const HistorySidebar = () => {
    const { currentChatId, switchChat } = useChatContext();
    //1.从本地存储获取历史会话
    const storedChats = localStorage.getItem('chat_list');
    const [chats, setChats] = useState(
        storedChats ? JSON.parse(storedChats) : [
            { id: 'default', name: '默认会话' },
            { id: 'chat1', name: '会话1' }]

    );
    //2.新建会话（有唯一id，更新到列表保存本地并切换到该会话）
    const handleNewChat = () => {
        const newChat = {
            id: `chat${Date.now()}`,
            name: `新会话${chats.length + 1}`
        };
        const newChats = [...chats, newChat];//所有的会话
        setChats(newChats);//更新会话列表
        localStorage.setItem('chat_list', JSON.stringify(newChats));
        switchChat(newChat.id);
    };
    //3.删除会话（从列表中移除，删除当前会话会切换到默认，同时删除本地数据）
    const handleDeleteChat = (id, e) => {
        e.stopPropagation(); //防止触发切换
        const newChats = chats.filter(chat => chat.id !== id);//从列表中移除指定会话
        setChats(newChats);
        localStorage.setItem('chat_list', JSON.stringify(newChats));
        //删除当前会话，切回默认
        if (id === currentChatId) {
            switchChat('default');
        }
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
                            cursor: 'pointer',//鼠标悬停变成手指
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