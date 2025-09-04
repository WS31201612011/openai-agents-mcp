// CANN助手前端交互脚本

// DOM元素
let currentSection = 'home';
let chatMessages = [];

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    setupMobileMenu();
    autoResizeTextarea();
});

// 初始化应用
function initializeApp() {
    console.log('CANN助手初始化...');
    
    // 设置默认活动导航
    const homeLink = document.querySelector('[data-section="home"]');
    if (homeLink) {
        homeLink.classList.add('active');
    }
    
    // 显示欢迎消息
    addWelcomeMessage();
}

// 设置事件监听器
function setupEventListeners() {
    // 导航链接点击事件
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const section = this.getAttribute('data-section');
            navigateToSection(section);
        });
    });

    // 发送按钮点击事件
    const sendButton = document.getElementById('sendButton');
    if (sendButton) {
        sendButton.addEventListener('click', sendMessage);
    }

    // 输入框回车事件
    const chatInput = document.getElementById('chatInput');
    if (chatInput) {
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });
    }
}

// 设置移动端菜单
function setupMobileMenu() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // 点击导航项时关闭菜单
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
}

// 自动调整文本框高度
function autoResizeTextarea() {
    const textarea = document.getElementById('chatInput');
    if (textarea) {
        textarea.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = Math.min(this.scrollHeight, 120) + 'px';
        });
    }
}

// 导航到指定部分
function navigateToSection(sectionName) {
    // 隐藏所有部分
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.classList.remove('active');
    });

    // 显示目标部分
    const targetSection = document.getElementById(sectionName);
    if (targetSection) {
        targetSection.classList.add('active');
    }

    // 更新导航状态
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-section') === sectionName) {
            link.classList.add('active');
        }
    });

    currentSection = sectionName;
    
    // 平滑滚动到顶部
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// 发送消息
function sendMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    
    if (!message) return;
    
    // 添加用户消息
    addMessage(message, 'user');
    
    // 清空输入框
    input.value = '';
    input.style.height = 'auto';
    
    // 模拟AI回复
    setTimeout(() => {
        generateAIResponse(message);
    }, 1000);
    
    // 添加到最近问题
    addToRecentQuestions(message);
}

// 添加消息到聊天窗口
function addMessage(content, type = 'user') {
    const chatMessages = document.getElementById('chatMessages');
    if (!chatMessages) return;

    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}-message`;
    
    const avatarDiv = document.createElement('div');
    avatarDiv.className = 'message-avatar';
    avatarDiv.innerHTML = type === 'user' ? '<i class="fas fa-user"></i>' : '<i class="fas fa-robot"></i>';
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    
    if (type === 'assistant' && typeof content === 'object') {
        // 处理复杂的AI回复
        contentDiv.innerHTML = content.html;
    } else {
        contentDiv.innerHTML = `<p>${content}</p>`;
    }
    
    messageDiv.appendChild(avatarDiv);
    messageDiv.appendChild(contentDiv);
    
    chatMessages.appendChild(messageDiv);
    
    // 滚动到底部
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    // 保存消息历史
    chatMessages.push({
        content: content,
        type: type,
        timestamp: new Date()
    });
}

// 生成AI回复
function generateAIResponse(userMessage) {
    // 显示输入指示器
    showTypingIndicator();
    
    setTimeout(() => {
        hideTypingIndicator();
        
        // 根据用户问题生成相应回复
        const response = generateResponseBasedOnQuery(userMessage);
        addMessage(response, 'assistant');
    }, 2000);
}

// 显示输入指示器
function showTypingIndicator() {
    const indicator = document.createElement('div');
    indicator.className = 'message assistant-message typing-indicator';
    indicator.innerHTML = `
        <div class="message-avatar">
            <i class="fas fa-robot"></i>
        </div>
        <div class="message-content">
            <div class="loading"></div>
            <span style="margin-left: 10px;">CANN助手正在思考...</span>
        </div>
    `;
    
    const chatMessages = document.getElementById('chatMessages');
    chatMessages.appendChild(indicator);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// 隐藏输入指示器
function hideTypingIndicator() {
    const indicator = document.querySelector('.typing-indicator');
    if (indicator) {
        indicator.remove();
    }
}

// 基于查询生成回复
function generateResponseBasedOnQuery(query) {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('安装') || lowerQuery.includes('环境') || lowerQuery.includes('配置')) {
        return {
            html: `
                <p>关于CANN环境安装配置，我为您提供以下指导：</p>
                <h4>🔧 安装步骤：</h4>
                <ol>
                    <li>下载CANN软件包：从华为昇腾官网获取最新版本</li>
                    <li>安装依赖：确保系统满足Python 3.7+、GCC 7.3+等要求</li>
                    <li>执行安装：运行安装脚本并配置环境变量</li>
                    <li>验证安装：使用示例代码验证环境是否正常</li>
                </ol>
                <h4>💡 配置建议：</h4>
                <ul>
                    <li>建议使用虚拟环境隔离CANN依赖</li>
                    <li>配置ASCEND_OPP_PATH等关键环境变量</li>
                    <li>确保昇腾硬件驱动版本匹配</li>
                </ul>
                <p>需要更详细的安装指导吗？我可以为您提供具体的命令和配置示例。</p>
            `
        };
    }
    
    if (lowerQuery.includes('api') || lowerQuery.includes('接口')) {
        return {
            html: `
                <p>Ascend C API是CANN的核心编程接口，主要包括：</p>
                <h4>🔧 核心API模块：</h4>
                <ul>
                    <li><strong>ACL Runtime API</strong>：设备管理、内存管理、流管理</li>
                    <li><strong>算子开发API</strong>：Kernel开发、算子注册、参数配置</li>
                    <li><strong>图执行API</strong>：计算图构建、优化、执行</li>
                    <li><strong>调试分析API</strong>：性能分析、精度调试</li>
                </ul>
                <h4>📝 使用示例：</h4>
                <pre><code>// 设备初始化
aclError ret = aclInit(nullptr);
aclrtContext context;
aclrtCreateContext(&context, 0);

// 内存分配
void* devicePtr;
aclrtMalloc(&devicePtr, dataSize, ACL_MEM_MALLOC_HUGE_FIRST);</code></pre>
                <p>您想了解哪个具体API的使用方法呢？</p>
            `
        };
    }
    
    if (lowerQuery.includes('精度') || lowerQuery.includes('调试')) {
        return {
            html: `
                <p>算子精度问题是开发中的常见挑战，以下是系统性的解决方案：</p>
                <h4>🔍 精度问题诊断：</h4>
                <ul>
                    <li>使用CANN提供的精度比较工具</li>
                    <li>设置合适的精度阈值进行验证</li>
                    <li>分析数值溢出和下溢问题</li>
                </ul>
                <h4>🛠️ 调试工具：</h4>
                <ul>
                    <li><strong>msaccucmp.py</strong>：精度比较工具</li>
                    <li><strong>dump工具</strong>：中间结果导出分析</li>
                    <li><strong>profiling工具</strong>：性能和精度联合分析</li>
                </ul>
                <h4>💡 优化策略：</h4>
                <ul>
                    <li>选择合适的数据类型（FP16/FP32）</li>
                    <li>优化量化策略</li>
                    <li>使用混合精度训练技术</li>
                </ul>
                <p>您遇到的具体精度问题是什么类型呢？我可以提供更针对性的解决方案。</p>
            `
        };
    }
    
    if (lowerQuery.includes('性能') || lowerQuery.includes('优化')) {
        return {
            html: `
                <p>CANN性能优化是一个系统工程，涉及多个层面：</p>
                <h4>🚀 性能优化策略：</h4>
                <ul>
                    <li><strong>算子级优化</strong>：使用高效的计算模式，优化内存访问模式</li>
                    <li><strong>图级优化</strong>：算子融合、内存复用、并行执行</li>
                    <li><strong>系统级优化</strong>：多卡并行、流水线优化</li>
                </ul>
                <h4>🔧 优化工具：</h4>
                <ul>
                    <li><strong>Profiler</strong>：性能瓶颈分析</li>
                    <li><strong>Advisor</strong>：优化建议生成</li>
                    <li><strong>Tuner</strong>：自动调优工具</li>
                </ul>
                <h4>📊 性能指标：</h4>
                <ul>
                    <li>吞吐量（Throughput）</li>
                    <li>延迟（Latency）</li>
                    <li>内存使用效率</li>
                    <li>计算单元利用率</li>
                </ul>
                <p>您的应用场景是什么？我可以提供更具体的性能优化建议。</p>
            `
        };
    }
    
    // 默认回复
    return {
        html: `
            <p>感谢您的提问！我已经收到您关于"${query}"的问题。</p>
            <p>基于CANN知识库搜索，我为您提供以下建议：</p>
            <ul>
                <li>📚 建议查阅CANN开发者指南相关章节</li>
                <li>🔍 可以在API文档中搜索相关接口</li>
                <li>💡 查看社区中的类似问题和解决方案</li>
                <li>🛠️ 尝试使用CANN提供的调试工具</li>
            </ul>
            <p>如果您需要更具体的帮助，请提供更多详细信息，我将为您提供更精准的解答。</p>
            <div style="margin-top: 1rem; padding: 1rem; background: #f8f9fa; border-radius: 8px; border-left: 4px solid var(--primary-color);">
                <strong>💡 提示：</strong> 您可以尝试询问具体的API使用方法、错误信息解析或性能优化建议。
            </div>
        `
    };
}

// 插入快速问题
function insertQuestion(question) {
    const chatInput = document.getElementById('chatInput');
    if (chatInput) {
        chatInput.value = question;
        chatInput.focus();
        // 自动调整高度
        chatInput.style.height = 'auto';
        chatInput.style.height = Math.min(chatInput.scrollHeight, 120) + 'px';
    }
}

// 添加到最近问题
function addToRecentQuestions(question) {
    const recentQuestions = document.getElementById('recentQuestions');
    if (!recentQuestions) return;
    
    const recentItem = document.createElement('div');
    recentItem.className = 'recent-item';
    recentItem.innerHTML = `
        <p>${question}</p>
        <span class="recent-time">刚刚</span>
    `;
    
    recentItem.addEventListener('click', function() {
        insertQuestion(question);
    });
    
    // 插入到顶部
    recentQuestions.insertBefore(recentItem, recentQuestions.firstChild);
    
    // 限制显示数量
    const items = recentQuestions.querySelectorAll('.recent-item');
    if (items.length > 5) {
        recentQuestions.removeChild(items[items.length - 1]);
    }
}

// 添加欢迎消息
function addWelcomeMessage() {
    // 欢迎消息已在HTML中静态添加
}

// 生成算子代码
function generateOperatorCode() {
    const operatorName = document.getElementById('operatorName').value;
    const operatorType = document.getElementById('operatorType').value;
    const operatorDesc = document.getElementById('operatorDesc').value;
    const inputShape = document.getElementById('inputShape').value;
    const outputShape = document.getElementById('outputShape').value;
    const dataType = document.getElementById('dataType').value;
    
    if (!operatorName || !operatorDesc) {
        alert('请填写算子名称和功能描述');
        return;
    }
    
    // 显示生成中状态
    const generateBtn = document.querySelector('.generate-btn');
    const originalText = generateBtn.innerHTML;
    generateBtn.innerHTML = '<div class="loading"></div> 生成中...';
    generateBtn.disabled = true;
    
    // 模拟代码生成
    setTimeout(() => {
        const generatedCode = generateCodeTemplate(operatorName, operatorType, operatorDesc, inputShape, outputShape, dataType);
        displayGeneratedCode(generatedCode);
        
        // 恢复按钮状态
        generateBtn.innerHTML = originalText;
        generateBtn.disabled = false;
    }, 3000);
}

// 生成代码模板
function generateCodeTemplate(name, type, desc, inputShape, outputShape, dataType) {
    const className = name || 'CustomOperator';
    const typeComment = type ? `// 算子类型: ${getOperatorTypeDesc(type)}` : '';
    const shapeComment = inputShape && outputShape ? `// 输入形状: ${inputShape}, 输出形状: ${outputShape}` : '';
    const dataTypeComment = dataType ? `// 数据类型: ${dataType}` : '';
    
    return `#include "acl/acl.h"
#include "ascend_c_api.h"
#include "aclnn/aclnn_base.h"

/**
 * ${desc || '自定义算子实现'}
 * ${typeComment}
 * ${shapeComment}
 * ${dataTypeComment}
 */

class ${className} {
private:
    // 算子参数
    aclOpExecutor* executor_;
    aclTensorDesc* inputDesc_;
    aclTensorDesc* outputDesc_;
    
    // 计算资源
    aclrtStream stream_;
    aclrtContext context_;
    
public:
    /**
     * 构造函数
     */
    ${className}() : executor_(nullptr), inputDesc_(nullptr), 
                     outputDesc_(nullptr), stream_(nullptr), context_(nullptr) {}
    
    /**
     * 析构函数
     */
    ~${className}() {
        Finalize();
    }
    
    /**
     * 初始化算子
     * @param deviceId 设备ID
     * @return 错误码
     */
    aclError Init(int32_t deviceId = 0) {
        // 设置设备
        aclError ret = aclrtSetDevice(deviceId);
        if (ret != ACL_SUCCESS) {
            printf("设置设备失败, 错误码: %d\\n", ret);
            return ret;
        }
        
        // 创建上下文
        ret = aclrtCreateContext(&context_, deviceId);
        if (ret != ACL_SUCCESS) {
            printf("创建上下文失败, 错误码: %d\\n", ret);
            return ret;
        }
        
        // 创建流
        ret = aclrtCreateStream(&stream_);
        if (ret != ACL_SUCCESS) {
            printf("创建流失败, 错误码: %d\\n", ret);
            return ret;
        }
        
        printf("${className} 初始化成功\\n");
        return ACL_SUCCESS;
    }
    
    /**
     * 设置输入输出描述符
     */
    aclError SetTensorDesc(const std::vector<int64_t>& inputShape,
                          const std::vector<int64_t>& outputShape,
                          aclDataType dataType = ACL_${dataType.toUpperCase()}) {
        // 创建输入张量描述符
        inputDesc_ = aclCreateTensorDesc(dataType, inputShape.size(), 
                                        inputShape.data(), ACL_FORMAT_ND);
        if (inputDesc_ == nullptr) {
            printf("创建输入张量描述符失败\\n");
            return ACL_ERROR_FAILURE;
        }
        
        // 创建输出张量描述符
        outputDesc_ = aclCreateTensorDesc(dataType, outputShape.size(), 
                                         outputShape.data(), ACL_FORMAT_ND);
        if (outputDesc_ == nullptr) {
            printf("创建输出张量描述符失败\\n");
            return ACL_ERROR_FAILURE;
        }
        
        return ACL_SUCCESS;
    }
    
    /**
     * 执行算子计算
     * @param inputData 输入数据
     * @param outputData 输出数据
     * @return 错误码
     */
    aclError Process(const void* inputData, void* outputData) {
        if (!inputData || !outputData) {
            printf("输入或输出数据为空\\n");
            return ACL_ERROR_INVALID_PARAM;
        }
        
        // TODO: 实现具体的算子计算逻辑
        // 这里需要根据具体算子类型实现计算逻辑
        ${generateProcessLogic(type)}
        
        // 同步流
        aclError ret = aclrtSynchronizeStream(stream_);
        if (ret != ACL_SUCCESS) {
            printf("流同步失败, 错误码: %d\\n", ret);
            return ret;
        }
        
        return ACL_SUCCESS;
    }
    
    /**
     * 释放资源
     */
    aclError Finalize() {
        aclError ret = ACL_SUCCESS;
        
        // 销毁张量描述符
        if (inputDesc_) {
            aclDestroyTensorDesc(inputDesc_);
            inputDesc_ = nullptr;
        }
        
        if (outputDesc_) {
            aclDestroyTensorDesc(outputDesc_);
            outputDesc_ = nullptr;
        }
        
        // 销毁流
        if (stream_) {
            ret = aclrtDestroyStream(stream_);
            stream_ = nullptr;
        }
        
        // 销毁上下文
        if (context_) {
            ret = aclrtDestroyContext(context_);
            context_ = nullptr;
        }
        
        return ret;
    }
};

/**
 * 使用示例
 */
int main() {
    // 初始化ACL
    aclError ret = aclInit(nullptr);
    if (ret != ACL_SUCCESS) {
        printf("ACL初始化失败\\n");
        return -1;
    }
    
    // 创建算子实例
    ${className} operator_instance;
    
    // 初始化算子
    ret = operator_instance.Init();
    if (ret != ACL_SUCCESS) {
        printf("算子初始化失败\\n");
        aclFinalize();
        return -1;
    }
    
    // 设置张量描述符
    std::vector<int64_t> inputShape = ${inputShape || '{1, 3, 224, 224}'};
    std::vector<int64_t> outputShape = ${outputShape || '{1, 64, 112, 112}'};
    
    ret = operator_instance.SetTensorDesc(inputShape, outputShape);
    if (ret != ACL_SUCCESS) {
        printf("设置张量描述符失败\\n");
        aclFinalize();
        return -1;
    }
    
    // TODO: 准备输入数据和输出缓冲区
    // void* inputData = ...;
    // void* outputData = ...;
    
    // 执行计算
    // ret = operator_instance.Process(inputData, outputData);
    
    printf("${className} 执行完成\\n");
    
    // 清理资源
    aclFinalize();
    return 0;
}`;
}

// 获取算子类型描述
function getOperatorTypeDesc(type) {
    const typeMap = {
        'conv': '卷积算子',
        'pooling': '池化算子',
        'activation': '激活函数',
        'norm': '归一化算子',
        'reduction': '规约算子',
        'element': '元素级算子',
        'custom': '自定义算子'
    };
    return typeMap[type] || '通用算子';
}

// 生成处理逻辑
function generateProcessLogic(type) {
    switch(type) {
        case 'conv':
            return `        // 卷积计算逻辑
        // 1. 配置卷积参数（步长、填充、膨胀等）
        // 2. 调用卷积计算API
        // 3. 处理输出数据`;
        
        case 'pooling':
            return `        // 池化计算逻辑
        // 1. 配置池化参数（窗口大小、步长等）
        // 2. 选择池化类型（最大池化/平均池化）
        // 3. 执行池化计算`;
        
        case 'activation':
            return `        // 激活函数计算逻辑
        // 1. 选择激活函数类型（ReLU、Sigmoid、Tanh等）
        // 2. 配置激活函数参数
        // 3. 执行逐元素激活计算`;
        
        default:
            return `        // 自定义算子计算逻辑
        // 1. 根据算子功能实现具体计算
        // 2. 优化内存访问模式
        // 3. 确保计算精度和性能`;
    }
}

// 显示生成的代码
function displayGeneratedCode(code) {
    const codeElement = document.getElementById('generatedCode');
    if (codeElement) {
        codeElement.textContent = code;
        
        // 添加语法高亮（简单实现）
        highlightCode(codeElement);
    }
}

// 简单的代码高亮
function highlightCode(element) {
    let code = element.textContent;
    
    // C++关键字高亮
    const keywords = ['class', 'public', 'private', 'if', 'else', 'for', 'while', 'return', 'void', 'int', 'const', 'static', 'virtual', 'override', 'namespace', 'using', 'include', 'define'];
    keywords.forEach(keyword => {
        const regex = new RegExp(`\\b${keyword}\\b`, 'g');
        code = code.replace(regex, `<span style="color: #569cd6;">${keyword}</span>`);
    });
    
    // 字符串高亮
    code = code.replace(/"([^"]*)"/g, '<span style="color: #ce9178;">"$1"</span>');
    
    // 注释高亮
    code = code.replace(/\/\/(.*)/g, '<span style="color: #6a9955;">//$1</span>');
    code = code.replace(/\/\*[\s\S]*?\*\//g, '<span style="color: #6a9955;">$&</span>');
    
    element.innerHTML = code;
}

// 复制代码
function copyCode() {
    const codeElement = document.getElementById('generatedCode');
    if (codeElement) {
        const text = codeElement.textContent;
        
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text).then(() => {
                showNotification('代码已复制到剪贴板');
            });
        } else {
            // 兼容性处理
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            showNotification('代码已复制到剪贴板');
        }
    }
}

// 下载代码
function downloadCode() {
    const codeElement = document.getElementById('generatedCode');
    const operatorName = document.getElementById('operatorName').value || 'CustomOperator';
    
    if (codeElement) {
        const code = codeElement.textContent;
        const blob = new Blob([code], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `${operatorName}.cpp`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        showNotification(`代码已下载为 ${operatorName}.cpp`);
    }
}

// 加载算子模板
function loadTemplate(templateType) {
    const templates = {
        'conv2d': {
            name: 'Conv2DOperator',
            type: 'conv',
            desc: '2D卷积运算，支持多种卷积核大小和步长配置，适用于图像特征提取',
            inputShape: '[N, C, H, W]',
            outputShape: '[N, C_out, H_out, W_out]',
            dataType: 'float16'
        },
        'relu': {
            name: 'ReLUOperator',
            type: 'activation',
            desc: 'ReLU激活函数，将负数置零，保持正数不变，是深度学习中最常用的激活函数',
            inputShape: '[N, C, H, W]',
            outputShape: '[N, C, H, W]',
            dataType: 'float16'
        },
        'pooling': {
            name: 'MaxPoolOperator',
            type: 'pooling',
            desc: '最大池化运算，在指定窗口内选择最大值，用于降采样和特征选择',
            inputShape: '[N, C, H, W]',
            outputShape: '[N, C, H/2, W/2]',
            dataType: 'float16'
        },
        'matmul': {
            name: 'MatMulOperator',
            type: 'custom',
            desc: '矩阵乘法运算，支持批量矩阵乘法，针对昇腾硬件优化的高性能实现',
            inputShape: '[M, K]',
            outputShape: '[M, N]',
            dataType: 'float16'
        }
    };
    
    const template = templates[templateType];
    if (template) {
        document.getElementById('operatorName').value = template.name;
        document.getElementById('operatorType').value = template.type;
        document.getElementById('operatorDesc').value = template.desc;
        document.getElementById('inputShape').value = template.inputShape;
        document.getElementById('outputShape').value = template.outputShape;
        document.getElementById('dataType').value = template.dataType;
        
        showNotification(`已加载 ${template.name} 模板`);
    }
}

// 显示通知
function showNotification(message) {
    // 创建通知元素
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: var(--gradient-primary);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: var(--border-radius);
        box-shadow: var(--shadow-medium);
        z-index: 10000;
        animation: slideInRight 0.3s ease;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // 3秒后自动移除
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// 添加滑动动画样式
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// 平滑滚动支持
function smoothScrollTo(element) {
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// 搜索功能（为未来扩展预留）
function searchDocuments(query) {
    console.log('搜索文档:', query);
    // TODO: 实现文档搜索功能
}

// 导出功能（为未来扩展预留）
function exportChatHistory() {
    const history = chatMessages.map(msg => ({
        type: msg.type,
        content: msg.content,
        timestamp: msg.timestamp.toISOString()
    }));
    
    const blob = new Blob([JSON.stringify(history, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cann_assistant_chat_history.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// 主题切换功能（为未来扩展预留）
function toggleTheme() {
    document.body.classList.toggle('dark-theme');
    localStorage.setItem('theme', document.body.classList.contains('dark-theme') ? 'dark' : 'light');
}

// 加载保存的主题
function loadSavedTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
    }
}

// 页面可见性变化处理
document.addEventListener('visibilitychange', function() {
    if (document.visibilityState === 'visible') {
        // 页面变为可见时的处理
        console.log('CANN助手页面已激活');
    }
});

// 错误处理
window.addEventListener('error', function(e) {
    console.error('CANN助手发生错误:', e.error);
    showNotification('发生了一个错误，请刷新页面重试');
});

// 页面离开前的提示（如果有未保存的内容）
window.addEventListener('beforeunload', function(e) {
    const chatInput = document.getElementById('chatInput');
    if (chatInput && chatInput.value.trim()) {
        e.preventDefault();
        e.returnValue = '';
    }
});

console.log('CANN助手脚本加载完成');