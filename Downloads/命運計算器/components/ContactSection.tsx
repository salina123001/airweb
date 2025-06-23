
import React from 'react';
import Input from './common/Input';
import Button from './common/Button';

const ContactSection: React.FC = () => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Mock submission
    alert("感謝您的訊息！我們將盡快回覆您。(此為模擬功能)");
    (e.target as HTMLFormElement).reset();
  };

  return (
    <section className="py-20 px-4 bg-gray-900">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
          聯絡我們
        </h2>
        <p className="text-center text-gray-300 mb-10 text-lg">
          對於命運計算器有任何疑問、建議或合作機會？歡迎隨時與我們聯繫。
        </p>
        
        <form onSubmit={handleSubmit} className="bg-gray-800/70 shadow-2xl rounded-xl p-8 md:p-12 space-y-6 glowing-shadow-purple">
          <Input 
            label="您的姓名" 
            type="text" 
            name="name" 
            placeholder="請輸入您的姓名" 
            required 
            className="bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400"
          />
          <Input 
            label="電子郵件" 
            type="email" 
            name="email" 
            placeholder="請輸入您的電子郵件" 
            required 
            className="bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400"
          />
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-purple-300 mb-1">您的訊息</label>
            <textarea
              id="message"
              name="message"
              rows={4}
              placeholder="請在此輸入您的訊息..."
              required
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500 text-gray-100 placeholder-gray-400 transition-colors"
            ></textarea>
          </div>
          <div className="text-center">
            <Button 
              type="submit"
              className="px-8 py-3 text-lg font-semibold bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 hover-glowing-shadow-pink"
            >
              傳送訊息
            </Button>
          </div>
        </form>

        <div className="mt-16 text-center text-gray-400">
          <h3 className="text-xl font-semibold text-purple-300 mb-4">其他聯絡方式</h3>
          <p>電子郵件: info@destinycalculator.example.com (模擬)</p>
          <p>電話: +886-2-1234-5678 (模擬)</p>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
