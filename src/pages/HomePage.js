import React from 'react';
import { Link } from 'react-router-dom';
import { 
  MessageSquare, 
  Code, 
  Wrench, 
  FileText, 
  AlertTriangle, 
  Download,
  ChevronRight,
  Sparkles,
  Zap,
  Shield
} from 'lucide-react';
import './HomePage.css';

const HomePage = () => {
  const capabilities = [
    {
      icon: Wrench,
      title: '工具类问题',
      description: '开发环境配置、工具链使用、编译调试等工具相关问题解答',
      color: '#ff6b6b'
    },
    {
      icon: Code,
      title: 'Ascend C API',
      description: '详细的API文档查询、使用示例和最佳实践指导',
      color: '#4ecdc4'
    },
    {
      icon: AlertTriangle,
      title: '算子精度问题',
      description: '算子精度分析、性能优化建议和问题诊断解决方案',
      color: '#45b7d1'
    },
    {
      icon: Download,
      title: '安装部署问题',
      description: '环境搭建、依赖安装、部署配置等全流程指导',
      color: '#96ceb4'
    },
    {
      icon: FileText,
      title: 'CANN文档',
      description: '智能文档检索、快速定位相关章节和详细说明',
      color: '#feca57'
    }
  ];

  const features = [
    {
      icon: MessageSquare,
      title: 'AI智能问答',
      description: '基于CANN知识库的智能问答系统，快速获取准确答案',
      link: '/qa',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    {
      icon: Code,
      title: 'AI算子开发',
      description: '智能生成Ascend C算子代码，提升开发效率',
      link: '/operator-dev',
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
    }
  ];

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-content fade-in">
            <h1 className="hero-title">
              <span className="gradient-text">CANN助手</span>
            </h1>
            <p className="hero-subtitle">
              华为昇腾硬件开发者的一站式AI解决方案
            </p>
            <p className="hero-description">
              专为互联网算子开发工程师打造，提供智能问答、代码生成、技术支持等全方位服务
            </p>
            <div className="hero-actions">
              <Link to="/qa" className="btn btn-primary">
                <Sparkles size={20} />
                开始使用
              </Link>
              <Link to="/operator-dev" className="btn btn-secondary">
                <Code size={20} />
                算子开发
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Capabilities Section */}
      <section className="capabilities-section">
        <div className="container">
          <h2 className="section-title">核心能力</h2>
          <p className="section-subtitle">
            CANN助手可以处理多种类型的技术问题，为开发者提供专业的技术支持
          </p>
          <div className="capabilities-grid">
            {capabilities.map((capability, index) => {
              const Icon = capability.icon;
              return (
                <div key={index} className="capability-card card fade-in">
                  <div className="capability-icon" style={{ backgroundColor: capability.color }}>
                    <Icon size={24} />
                  </div>
                  <h3 className="capability-title">{capability.title}</h3>
                  <p className="capability-description">{capability.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <h2 className="section-title">主要功能</h2>
          <p className="section-subtitle">
            集成AI技术，为CANN开发者提供智能化的开发体验
          </p>
          <div className="features-grid">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Link key={index} to={feature.link} className="feature-card card">
                  <div className="feature-header">
                    <div 
                      className="feature-icon"
                      style={{ background: feature.gradient }}
                    >
                      <Icon size={28} />
                    </div>
                    <ChevronRight className="feature-arrow" size={20} />
                  </div>
                  <h3 className="feature-title">{feature.title}</h3>
                  <p className="feature-description">{feature.description}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="benefits-section">
        <div className="container">
          <h2 className="section-title">为什么选择CANN助手</h2>
          <div className="benefits-grid">
            <div className="benefit-card card">
              <div className="benefit-icon">
                <Zap size={32} />
              </div>
              <h3 className="benefit-title">高效开发</h3>
              <p className="benefit-description">
                AI辅助代码生成，大幅提升算子开发效率，减少重复性工作
              </p>
            </div>
            <div className="benefit-card card">
              <div className="benefit-icon">
                <Shield size={32} />
              </div>
              <h3 className="benefit-title">专业可靠</h3>
              <p className="benefit-description">
                基于华为昇腾官方知识库，确保技术答案的准确性和权威性
              </p>
            </div>
            <div className="benefit-card card">
              <div className="benefit-icon">
                <Sparkles size={32} />
              </div>
              <h3 className="benefit-title">智能体验</h3>
              <p className="benefit-description">
                自然语言交互，智能理解开发需求，提供个性化解决方案
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">开始您的CANN开发之旅</h2>
            <p className="cta-description">
              立即体验CANN助手，让AI成为您的开发伙伴
            </p>
            <Link to="/qa" className="btn btn-primary btn-large">
              <MessageSquare size={20} />
              立即开始
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;