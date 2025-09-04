import React, { useState } from 'react';
import { 
  Send, 
  Search, 
  MessageSquare, 
  Bot, 
  User,
  Lightbulb,
  Clock,
  ThumbsUp,
  ThumbsDown,
  Copy,
  CheckCircle
} from 'lucide-react';
import './QAPage.css';

const QAPage = () => {
  const [question, setQuestion] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);

  const quickQuestions = [
    '如何配置CANN开发环境？',
    'Ascend C API的基本使用方法',
    '算子精度问题如何排查？',
    'CANN安装过程中常见错误解决',
    '如何优化算子性能？',
    '昇腾硬件支持哪些数据类型？'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: question,
      timestamp: new Date()
    };

    setChatHistory(prev => [...prev, userMessage]);
    setQuestion('');
    setIsLoading(true);

    // 模拟AI回答
    setTimeout(() => {
      const aiMessage = {
        id: Date.now() + 1,
        type: 'assistant',
        content: generateMockResponse(question),
        timestamp: new Date(),
        sources: [
          { title: 'CANN开发指南', url: '#' },
          { title: 'Ascend C API参考', url: '#' }
        ]
      };
      setChatHistory(prev => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const generateMockResponse = (question) => {
    const responses = {
      'default': `根据您的问题"${question}"，我在CANN知识库中找到了相关信息：

**解决方案：**

1. **环境检查**：首先确认您的开发环境配置是否正确
2. **API使用**：参考官方文档中的示例代码
3. **调试方法**：使用CANN提供的调试工具进行问题定位

**代码示例：**
\`\`\`cpp
#include "kernel_operator.h"
using namespace AscendC;

class MyKernel {
public:
    __aicore__ inline void Init(GM_ADDR x, GM_ADDR y) {
        // 初始化代码
    }
    
    __aicore__ inline void Process() {
        // 处理逻辑
    }
};
\`\`\`

**注意事项：**
- 确保使用正确的API版本
- 注意内存对齐要求
- 遵循CANN编程规范

如果问题仍未解决，建议查看详细文档或联系技术支持。`
    };
    
    return responses.default;
  };

  const handleQuickQuestion = (q) => {
    setQuestion(q);
  };

  const handleCopy = async (content, index) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error('复制失败:', err);
    }
  };

  const handleFeedback = (messageId, type) => {
    console.log(`Feedback for message ${messageId}: ${type}`);
    // 这里可以添加反馈处理逻辑
  };

  return (
    <div className="qa-page">
      <div className="container">
        <div className="qa-layout">
          {/* 侧边栏 */}
          <aside className="qa-sidebar">
            <div className="sidebar-section">
              <h3 className="sidebar-title">
                <Lightbulb size={20} />
                常见问题
              </h3>
              <div className="quick-questions">
                {quickQuestions.map((q, index) => (
                  <button
                    key={index}
                    className="quick-question-btn"
                    onClick={() => handleQuickQuestion(q)}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* 主聊天区域 */}
          <main className="qa-main">
            <div className="qa-header">
              <h1 className="qa-title">
                <MessageSquare size={28} />
                AI智能问答
              </h1>
              <p className="qa-subtitle">
                向CANN助手提问，获取专业的技术支持和解决方案
              </p>
            </div>

            <div className="chat-container">
              {chatHistory.length === 0 ? (
                <div className="empty-state">
                  <Bot size={64} className="empty-icon" />
                  <h3>欢迎使用CANN助手</h3>
                  <p>我可以帮您解答CANN相关的技术问题，请在下方输入您的问题</p>
                </div>
              ) : (
                <div className="chat-messages">
                  {chatHistory.map((message, index) => (
                    <div key={message.id} className={`message ${message.type}`}>
                      <div className="message-avatar">
                        {message.type === 'user' ? (
                          <User size={20} />
                        ) : (
                          <Bot size={20} />
                        )}
                      </div>
                      <div className="message-content">
                        <div className="message-header">
                          <span className="message-sender">
                            {message.type === 'user' ? '您' : 'CANN助手'}
                          </span>
                          <span className="message-time">
                            <Clock size={14} />
                            {message.timestamp.toLocaleTimeString()}
                          </span>
                        </div>
                        <div className="message-text">
                          {message.content.split('\n').map((line, i) => (
                            <React.Fragment key={i}>
                              {line}
                              {i < message.content.split('\n').length - 1 && <br />}
                            </React.Fragment>
                          ))}
                        </div>
                        {message.type === 'assistant' && (
                          <div className="message-actions">
                            <button
                              className="action-btn"
                              onClick={() => handleCopy(message.content, index)}
                              title="复制回答"
                            >
                              {copiedIndex === index ? (
                                <CheckCircle size={16} />
                              ) : (
                                <Copy size={16} />
                              )}
                            </button>
                            <button
                              className="action-btn"
                              onClick={() => handleFeedback(message.id, 'like')}
                              title="有帮助"
                            >
                              <ThumbsUp size={16} />
                            </button>
                            <button
                              className="action-btn"
                              onClick={() => handleFeedback(message.id, 'dislike')}
                              title="没帮助"
                            >
                              <ThumbsDown size={16} />
                            </button>
                          </div>
                        )}
                        {message.sources && (
                          <div className="message-sources">
                            <h4>参考资料：</h4>
                            {message.sources.map((source, i) => (
                              <a key={i} href={source.url} className="source-link">
                                {source.title}
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="message assistant">
                      <div className="message-avatar">
                        <Bot size={20} />
                      </div>
                      <div className="message-content">
                        <div className="loading-indicator">
                          <div className="typing-dots">
                            <span></span>
                            <span></span>
                            <span></span>
                          </div>
                          <span>CANN助手正在思考...</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <form className="qa-form" onSubmit={handleSubmit}>
              <div className="input-container">
                <input
                  type="text"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="请输入您的问题..."
                  className="question-input"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  className="submit-btn"
                  disabled={!question.trim() || isLoading}
                >
                  <Send size={20} />
                </button>
              </div>
            </form>
          </main>
        </div>
      </div>
    </div>
  );
};

export default QAPage;