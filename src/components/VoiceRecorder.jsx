import { useChatContext } from '../context/ChatContext';
import { useState, useRef, useEffect } from 'react';

export const VoiceRecorder = () => {
    const { isRecording, setIsRecording, sendVoiceMessage } = useChatContext();
    //1.创建语音识别实例
    const recognitionRef = useRef(null);

    //2.初始化语音识别
    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;//检查浏览器是否支持语音识别
        if (SpeechRecognition) { //如果支持，创建识别实例并配置相关属性
            recognitionRef.current = new SpeechRecognition();//创建识别实例
            recognitionRef.current.continuous = false; //只识别一次
            recognitionRef.current.interimResults = false; //只返回最终识别结果
            recognitionRef.current.lang = 'zh-CN'; //识别成中文
        } else {
            alert('当前浏览器不支持语音识别，请使用 Chrome 浏览器');
        }
    }, []);

    //3.切换语音状态，控制开始和停止
    const toggleRecording = () => {
        const recognition = recognitionRef.current;//获取语音识别实例
        if (!recognition) return;

        if (isRecording) {
            // 停止识别
            recognition.stop();
            setIsRecording(false);
        } else {
            // 开始识别
            setIsRecording(true);
            let resultText = '';

            // 监听识别结果
            recognition.onresult = (event) => {
                resultText = event.results[0][0].transcript; //识别到的文本
            };

            // 识别结束后发送信息
            recognition.onend = () => {
                setIsRecording(false);
                if (resultText.trim()) {
                    sendVoiceMessage(resultText); //发送语音信息
                }
            };

            // 处理识别错误
            recognition.onerror = (error) => {
                console.error('语音识别错误：', error);
                setIsRecording(false);
                alert('语音识别失败，请重试');
            };
            //开始识别
            recognition.start();
        }
    };

    return (
        <button
            type="button"
            onClick={toggleRecording}
            disabled={!recognitionRef.current}//禁用按钮，直到语音识别初始化完成
        >
            {isRecording ? '停止语音输入' : '语音输入'}
        </button>
    );
};