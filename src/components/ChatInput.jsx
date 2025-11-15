import { useChatContext } from '../context/ChatContext';
import { useState } from 'react';
import { VoiceRecorder } from './VoiceRecorder';
//输入文本
export const ChatInput = () => {
    const { sendMessage } = useChatContext();//获取发送信息逻辑
    const [inputText, setInputText] = useState('');
    // 1.发送消息
    const handleSubmit = (e) => {
        e.preventDefault();//阻止表单默认提交
        sendMessage(inputText);
        setInputText('');
    };
    return (
        //表单默认绑定手动与enter
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
            <input
                placeholder="输入消息..."
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}//绑定输入框，把内容同步给状态
                style={{ flex: 1, padding: '8px' }}
            />
            <button type="submit">发送</button>
            <VoiceRecorder />
        </form>
    );
};