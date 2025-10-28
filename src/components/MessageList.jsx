import { useChatContext } from '../context/ChatContext';
import { useEffect, useRef } from 'react';
export const MessageList = () => {
    const { messages, isTyping } = useChatContext();//获取messages（消息数组）和isTyping（表示对方是否正在输入的状态）
    //1.使用useRef创建一个引用listRef，用于后续操作DOM元素
    const listRef = useRef(null);
    //2.自动滚动到最新消息
    useEffect(() => { //使用useEffect监听消息变化，当messages变化时自动执行
        if (listRef.current) {
            listRef.current.scrollTop = listRef.current.scrollHeight;//检查listRef.current是否存在，如果存在则设置滚动条位置到最底部
        }   //这确保了每当有新消息时，消息列表会自动滚动到最新消息的位置
    }, [messages]);
    return (
        <div ref={listRef} style={{ height: '600px', overflowY: 'auto', border: '1px solid #ccc' }}>
            {/* 渲染历史消息 */}
            {messages.map((msg, idx) => (
                <div key={idx}>
                    <p>{msg.role === 'user' ? '你' : 'DeepSeek'}：{msg.content}</p>
                </div>
            ))}
            {/* 打字动效 */}
            {isTyping && <div>DeepSeek 正在输入...</div>}
        </div>
    );
};