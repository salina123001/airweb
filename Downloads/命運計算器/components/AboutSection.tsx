
import React from 'react';

const AboutSection: React.FC = () => {
  const aboutData = [
    {
      title: '生肖 (Chinese Zodiac)',
      description: '生肖，又稱屬相，是中國及東亞地區用來代表年份的十二種動物。每個人根據其出生年份被賦予一個生肖，這通常與個性特徵和運勢相關聯。十二生肖依序為：鼠、牛、虎、兔、龍、蛇、馬、羊、猴、雞、狗、豬，構成一個十二年的循環。',
      icon: '🐉',
      color: 'bg-red-700/50',
      shadowColor: 'hover:shadow-red-500/40',
    },
    {
      title: '星座 (Western Astrology)',
      description: '西方占星學根據個人出生時太陽在黃道十二宮的位置來劃分星座。共有十二個星座，每個星座代表一段時間，並被認為影響個人的性格、特點和命運。星座分析是了解自我和人際關係的流行方式之一。',
      icon: '⚖️',
      color: 'bg-blue-700/50',
      shadowColor: 'hover:shadow-blue-500/40',
    },
    {
      title: '生命靈數 (Life Path Number)',
      description: '生命靈數是數字命理學中的核心概念，通過將出生日期的所有數字相加並簡化至個位數（或特殊主數11、22、33）來計算。這個數字被認為揭示了個人的天賦、挑戰、人生目標和整體生命路徑。',
      icon: '🔢',
      color: 'bg-green-700/50',
      shadowColor: 'hover:shadow-green-500/40',
    },
  ];

  return (
    <section className="py-20 px-4 bg-gray-800">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-16 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400">
          命理基本介紹
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {aboutData.map((item, index) => (
            <div 
              key={index} 
              className={`p-8 rounded-xl shadow-xl transition-all duration-300 transform hover:scale-105 ${item.color} ${item.shadowColor}`}
            >
              <div className="text-5xl mb-6 text-center">{item.icon}</div>
              <h3 className="text-2xl font-semibold text-gray-100 mb-4 text-center">{item.title}</h3>
              <p className="text-gray-300 leading-relaxed text-sm">
                {item.description}
              </p>
            </div>
          ))}
        </div>
        <p className="text-center text-gray-400 mt-16 text-lg">
          我們的命運計算器結合了這些古老的智慧，並融入現代AI技術，為您提供獨特而深刻的個人化解讀。
        </p>
      </div>
    </section>
  );
};

export default AboutSection;
