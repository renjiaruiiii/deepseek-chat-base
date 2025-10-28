import { createContext, useContext, useState, useEffect } from 'react';
import { fetchDeepseekResponse } from '../services/deepseekApi';
/* 1.创建数据通道 */
const ChatContext = createContext();
/* 2.功能更新逻辑：顶层组件使用数据通道传数据给子组件 */
export const ChatProvider = ({ children }) => {
    // 1. 定义核心状态管理（像数据，状态等，声明这些变量）
    const [messages, setMessages] = useState([]); // 对话消息列表
    const [currentChatId, setCurrentChatId] = useState('default'); // 当前会话ID
    const [isRecording, setIsRecording] = useState(false); // 语音录制状态
    const [isTyping, setIsTyping] = useState(false); // 机器人打字动效
    // 2. 消息发送逻辑（对接 DeepSeek API）（1.发送文本信息2.信息加入列表 3.调用API机器人进行回复 4.回复信息加入列表）
    const sendMessage = async (text) => { //async进行一个异步函数的声明
        if (!text.trim()) return;//如果文本为空，则返回，不执行后续操作
        // 发送文本信息
        const userMsg = { role: 'user', content: text, time: Date.now() };// 接收用户输入文本
        //返回一个新的数组，包含了prev中的所有元素，userMsg作为最后一个元素。[...prev, userMsg]：这里使用了ES6的扩展运算符
        setMessages(prev => [...prev, userMsg]); //使用setMessages函数更新消息列表，将用户输入的文本加入消息列表
        setIsTyping(true);
        // 调用 DeepSeek API进行回复
        // （1.try包含主要逻辑 2.catch处理错误情况 3.finally确保无论成功与否都会执行清理操作）
        try {
            const response = await fetchDeepseekResponse(text, currentChatId);//await关键字等待fetchDeepseekResponse函数完成，
            // fetchDeepseekResponse是一个异步函数，负责向Deepseek API发送请求并获取回复
            const botMsg = { role: 'assistant', content: response.reply, time: Date.now() };//获取到的ai回复结果
            setMessages(prev => [...prev, botMsg]);//使用setMessages函数更新消息列表，机器人回复问题的正确结果
        } catch (error) {
            const errorMsg = { role: 'assistant', content: '请求失败，请重试', time: Date.now() };
            setMessages(prev => [...prev, errorMsg]);//机器人回答不了，报错
        } finally {
            setIsTyping(false);//使用setIsTyping函数控制"正在输入"状态
        }
    };
    // 3. 语音消息逻辑（结合 Web Speech API）（1.语音转文字 2.调用sendmessage处理文本信息）
    const sendVoiceMessage = async (text) => { //(text) => 是一个箭头函数，接受一个名为 text 的参数
        if (text.trim()) sendMessage(text); //如果文本非空，则调用 sendMessage 函数并将原始文本作为参数传递
    };
    // 4. 会话切换逻辑（切换id时加载对应会话消息，本地存储）
    const switchChat = (chatId) => {
        setCurrentChatId(chatId); //更新当前活动聊天ID
        // 从本地存储加载历史消息
        const storedMessages = localStorage.getItem(`chat_${chatId}`);//从浏览器的localStorage中加载与该chatId关联的历史消息
        if (storedMessages) {
            setMessages(JSON.parse(storedMessages));// 如果存在历史消息，则将其解析为JSON对象并更新状态
        } else {
            setMessages([]);
        }
    };
    // 5. 会话保存逻辑（本地存储消息）使用useEffect在message或会话ID变化时自动保存到localStorage
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
/* 3.自定义 Hook，方便其他组件调用以上数据状态 */
export const useChatContext = () => useContext(ChatContext);