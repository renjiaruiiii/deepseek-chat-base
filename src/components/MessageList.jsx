import { useChatContext } from '../context/ChatContext';
import { useEffect, useRef } from 'react';
export const MessageList = () => {
    const { messages, isTyping } = useChatContext();
    //1.useRef获取dom元素
    const listRef = useRef(null);
    //2.自动滚动到最新消息
    useEffect(() => {
        if (listRef.current)
            listRef.current.scrollTop = listRef.current.scrollHeight;
    }, [messages]);
    return (
        <div ref={listRef} style={{ height: '600px', overflow: 'auto', border: '1px solid #ccc' }}>
            {/*  渲染消息 */}
            {messages.map((msg, index) => (
                <div key={index}>
                    <p>{msg.role === 'user' ? '你' : 'DeepSeek'}：{msg.content}</p>
                </div>
            ))}
            {/* 打字提示 */}
            {isTyping && <div>DeepSeek: 正在输入...</div>}
        </div>
    );
};