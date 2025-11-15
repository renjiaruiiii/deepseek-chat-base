import { createContext, useContext, useState, useEffect } from 'react';
import { fetchDeepseekResponse } from '../services/deepseekApi';
/* 1.创建数据通道 */
const ChatContext = createContext();
/* 2.功能更新逻辑：顶层组件使用数据通道传数据给子组件 */
export const ChatProvider = ({ children }) => {
    // 1. 定义全局数据状态（创建这些变量状态）
    const [messages, setMessages] = useState([]);//消息列表
    const [currentChatId, setCurrentChatId] = useState('default');//当前会话ID
    const [isRecording, setIsRecording] = useState(false); //语音录制状态
    const [isTyping, setIsTyping] = useState(false);//机器人打字动效
    // 2. 消息发送逻辑（对接 DeepSeek API）（1.发送文本信息2.信息更新列表 3.调用API机器人进行回复 4.回复信息更新列表）
    const sendMessage = async (text) => { //async声明异步函数
        if (!text.trim()) return;
        // 1.发送文本信息
        const userMsg = { role: 'user', content: text, time: Date.now() };
        //新数组，包含prev中的所有元素，userMsg是最后一个元素，[...prev, userMsg]：是ES6的扩展运算符
        setMessages(prev => [...prev, userMsg]);
        setIsTyping(true);//正在输入
        // 2.调用DeepSeek回复
        // （1.try回复消息主要逻辑 2.catch处理错误情况 3.finally无论成功or失败都会清除打字特效）
        try {
            const response = await fetchDeepseekResponse(text, currentChatId);//await等待fetchDeepseekResponse函数回复，
            // fetchDeepseekResponse是一个异步函数，向API发送请求取得回复
            const botMsg = {
                role: 'assistant',    //ai回复信息
                content: response.reply,
                time: Date.now()
            };
            setMessages(prev => [...prev, botMsg]);
        }
        catch (error) {
            const errorMsg = {
                role: 'assistant',
                content: '请求失败，请重试',
                time: Date.now()
            };
            setMessages(prev => [...prev, errorMsg]);
        }
        finally {
            setIsTyping(false);//打字动效over
        }
    };
    // 3. 语音消息（结合 Web Speech API）（1.语音转文字 2.调用sendmessage处理文本信息）
    const sendVoiceMessage = async (text) => { //(text) => 是一个箭头函数，接受一个名为 text 的参数
        if (text.trim()) {
            sendMessage(text); //调用sendMessage把原始文本当作参数发送
        }
    };
    // 4. 会话切换（切换id时加载对应会话消息，本地存储）
    const switchChat = (chatId) => {
        setCurrentChatId(chatId);//当前最新id
        const storedMessages = localStorage.getItem(`chat_${chatId}`);
        if (storedMessages) {
            setMessages(JSON.parse(storedMessages));
        } else {
            setMessages([]);
        }
    };
    // 5. 会话保村（本地存储消息）useEffect在message或会话ID变化时自动保存到localStorage
    useEffect(() => {
        localStorage.setItem(`chat_${currentChatId}`, JSON.stringify(messages));
    }, [messages, currentChatId]);
    // 6. 暴露给组件的方法和状态
    const value = {
        messages,
        currentChatId,
        isRecording,
        setIsRecording,
        isTyping,
        sendMessage,
        sendVoiceMessage,
        switchChat
    };
    return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
/* 3.其他组件调用以上数据状态 */
export const useChatContext = () => useContext(ChatContext);