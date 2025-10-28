import { useChatContext } from '../context/ChatContext';
import { useState, useRef, useEffect } from 'react';

export const VoiceRecorder = () => {
    const { isRecording, setIsRecording, sendVoiceMessage } = useChatContext();
    const recognitionRef = useRef(null); // 语音识别实例

    // 1.初始化语音识别
    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;// 代码首先检查浏览器是否支持语音识别 API
        if (SpeechRecognition) { //如果支持，则创建一个 SpeechRecognition 实例并设置相关属性
            recognitionRef.current = new SpeechRecognition();//创建一个 SpeechRecognition 实例
            recognitionRef.current.continuous = false; // 一次识别结束后停止
            recognitionRef.current.interimResults = false; // 只返回最终识别结果
            recognitionRef.current.lang = 'zh-CN'; //设置识别语言为中文
        } else {
            alert('当前浏览器不支持语音识别，请使用 Chrome 浏览器');//如果不支持，则弹出提示信息要求用户使用 Chrome 浏览器
        }
    }, []);

    // 2. 是一个切换语音识别功能的切换函数，用于控制语音识别的开始和停止
    const toggleRecording = () => {
        const recognition = recognitionRef.current;//获取语音识别实例
        if (!recognition) return;//如果没有获取到语音识别实例，则直接返回

        if (isRecording) {
            // 停止识别
            recognition.stop();
            setIsRecording(false);
        } else {
            // 开始识别
            setIsRecording(true);
            let resultText = '';

            // 监听识别结果
            recognition.onresult = (event) => { //监听识别结果，将识别到的文本保存到 resultText
                resultText = event.results[0][0].transcript; // event.results[0][0].transcript 是识别到的文本
            };

            // 识别结束后，将识别到的文本通过 sendVoiceMessage 发送
            recognition.onend = () => {
                setIsRecording(false);//识别结束后，将 isRecording 设置为 false
                if (resultText.trim()) { //如果识别到的文本不为空，则调用 sendVoiceMessage 发送
                    sendVoiceMessage(resultText); // 调用 Context 方法发送转好的文字
                }
            };

            // 处理识别过程中可能出现的错误
            recognition.onerror = (error) => {
                console.error('语音识别错误：', error);//如果出现错误，则输出错误信息
                setIsRecording(false); //将 isRecording 设置为 false
                alert('语音识别失败，请重试'); //弹出提示信息
            };

            recognition.start(); //开始识别
        }
    };

    return (
        <button type="button" onClick={toggleRecording} disabled={!recognitionRef.current}>
            {isRecording ? '停止语音输入' : '语音输入'}
        </button>
    );
};