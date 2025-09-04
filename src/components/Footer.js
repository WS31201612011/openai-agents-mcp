import React from 'react';
import { Heart } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>CANN助手</h3>
            <p>华为昇腾硬件开发者的一站式AI解决方案</p>
          </div>
          
          <div className="footer-section">
            <h4>快速链接</h4>
            <ul>
              <li><a href="/">首页</a></li>
              <li><a href="/qa">AI问答</a></li>
              <li><a href="/operator-dev">算子开发</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>技术支持</h4>
            <ul>
              <li><a href="#" target="_blank">CANN官方文档</a></li>
              <li><a href="#" target="_blank">开发者社区</a></li>
              <li><a href="#" target="_blank">技术博客</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>关于我们</h4>
            <ul>
              <li><a href="#" target="_blank">华为昇腾</a></li>
              <li><a href="#" target="_blank">开源项目</a></li>
              <li><a href="#" target="_blank">联系我们</a></li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>
            © 2024 华为技术有限公司. 保留所有权利. 
            Made with <Heart size={16} className="heart" /> for developers.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;