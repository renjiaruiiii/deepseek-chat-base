// 主组件：仅串联侧边栏、聊天区，不写样式
import { MessageList } from './components/MessageList';
import { ChatInput } from './components/ChatInput';
import { HistorySidebar } from './components/HistorySidebar';
function App() {
    return (
        <div>
            {/* 1. 侧边栏 + 主聊天区 骨架 */}
            <div>
                <HistorySidebar />
                <div>
                    {/* 2. 聊天区：消息列表 + 输入区 */}
                    <MessageList />
                    <ChatInput />
                </div>
            </div>
        </div>
    );
}
export default App;