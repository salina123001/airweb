import React, { useState, useCallback } from 'react';
import { UserInput, Gender, CalculationResults, AIInterpretation, FortuneOutput } from '../types';
import { calculateFortuneDetails } from '../utils/fortuneUtils';
import { getAIInterpretations } from '../services/geminiService';
import { CHINESE_ZODIAC_EMOJIS, ASTROLOGY_SIGN_EMOJIS } from '../constants';
import Input from './common/Input';
import Button from './common/Button';
import RadioGroup from './common/RadioGroup';
import LoadingSpinner from './LoadingSpinner';

const CalculatorSection: React.FC = () => {
  const [userInput, setUserInput] = useState<UserInput>({
    birthDate: '',
    gender: Gender.FEMALE, 
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [fortuneOutput, setFortuneOutput] = useState<FortuneOutput | null>(null);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setUserInput(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }, []);

  const handleGenderChange = useCallback((value: string) => {
    setUserInput(prev => ({ ...prev, gender: value as Gender }));
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!userInput.birthDate) {
      setError("請輸入您的出生日期。");
      return;
    }
    setIsLoading(true);
    setError(null);
    setFortuneOutput(null);

    try {
      const calculationResults: CalculationResults = calculateFortuneDetails(userInput);
      const aiInterpretations: AIInterpretation = await getAIInterpretations(userInput, calculationResults);
      
      setFortuneOutput({ ...calculationResults, ...aiInterpretations });

    } catch (err) {
      console.error("測算失敗:", err);
      const message = err instanceof Error ? err.message : "無法完成命運測算，請稍後再試。";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const genderOptions = [
    { label: '女性', value: Gender.FEMALE },
    { label: '男性', value: Gender.MALE },
  ];

  return (
    <section className="py-20 px-4 bg-gray-800/30 backdrop-blur-md">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
          開始您的命運測算
        </h2>
        
        <form onSubmit={handleSubmit} className="bg-gray-700/60 shadow-2xl rounded-xl p-8 md:p-12 space-y-8 glowing-shadow-purple backdrop-blur-sm">
          <div>
            <Input
              label="出生日期"
              type="date"
              name="birthDate"
              value={userInput.birthDate}
              onChange={handleChange}
              required
              className="bg-gray-600/80 border-gray-500 text-gray-100 placeholder-gray-400"
              max={new Date().toISOString().split("T")[0]} // Prevent future dates
            />
          </div>
          <div>
            <Input
              label="出生時間 (選填)"
              type="time"
              name="birthTime"
              value={userInput.birthTime || ''}
              onChange={handleChange}
              className="bg-gray-600/80 border-gray-500 text-gray-100 placeholder-gray-400"
            />
          </div>
          <div>
            <RadioGroup
              label="性別"
              name="gender"
              options={genderOptions}
              selectedValue={userInput.gender}
              onChange={handleGenderChange}
            />
          </div>
          <div className="text-center pt-4">
            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full md:w-auto px-10 py-4 text-lg font-semibold bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none hover-glowing-shadow-purple"
            >
              {isLoading ? '測算中...' : '開始命運測算'}
            </Button>
          </div>
        </form>

        {isLoading && <LoadingSpinner />}

        {error && (
          <div className="mt-8 p-6 bg-red-800/80 text-red-100 rounded-lg shadow-md text-center backdrop-blur-sm">
            <h3 className="font-semibold text-lg mb-2">測算失敗</h3>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {fortuneOutput && !isLoading && (
          <div className="mt-12 bg-gray-700/60 shadow-xl rounded-xl p-8 md:p-12 space-y-10 animate-fadeIn backdrop-blur-sm">
            <h3 className="text-3xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-blue-400">您的命運啟示</h3>
            
            <div className="grid md:grid-cols-3 gap-6 mb-8 text-center">
              <InfoCard title="您的生肖" value={fortuneOutput.chineseZodiac} emoji={CHINESE_ZODIAC_EMOJIS[fortuneOutput.chineseZodiac] || '❓'} />
              <InfoCard title="您的星座" value={fortuneOutput.astrologySign} emoji={ASTROLOGY_SIGN_EMOJIS[fortuneOutput.astrologySign] || '❓'} />
              <InfoCard title="您的生命靈數" value={fortuneOutput.lifePathNumber.toString()} emoji="🔢" />
            </div>

            <div className="space-y-8">
              <InterpretationCard title="愛情運勢" content={fortuneOutput.loveFortune} icon="💖" />
              <InterpretationCard title="事業與財運" content={fortuneOutput.careerWealth} icon="💼" />
              <InterpretationCard title="個人成長方向" content={fortuneOutput.personalGrowth} icon="🌱" />
              <InterpretationCard title="流年運勢" content={fortuneOutput.yearlyLuckForecast} icon="🗓️" />
              <InterpretationCard title="未來三個月運勢" content={fortuneOutput.futureThreeMonthsForecast} icon="✨" />
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

interface InfoCardProps {
  title: string;
  value: string;
  emoji: string;
}

const InfoCard: React.FC<InfoCardProps> = ({ title, value, emoji }) => (
  <div className="bg-purple-800/60 p-6 rounded-lg shadow-lg flex flex-col items-center justify-center space-y-2 transform hover:scale-105 transition-transform duration-300">
    <span className="text-4xl" role="img" aria-label={title}>{emoji}</span>
    <h4 className="text-lg font-semibold text-pink-300">{title}</h4>
    <p className="text-2xl text-gray-100 font-medium">{value}</p>
  </div>
);


interface InterpretationCardProps {
  title: string;
  content: string;
  icon: string;
}

const InterpretationCard: React.FC<InterpretationCardProps> = ({ title, content, icon }) => (
  <div className="bg-indigo-900/50 p-6 rounded-xl shadow-lg hover:shadow-indigo-500/40 transition-all duration-300 hover:ring-2 hover:ring-indigo-400/50">
    <h4 className="text-2xl font-semibold text-blue-300 mb-4 flex items-center">
      <span className="text-3xl mr-3 transform group-hover:rotate-12 transition-transform duration-300">{icon}</span>
      {title}
    </h4>
    <p className="text-gray-200 leading-relaxed whitespace-pre-wrap text-sm md:text-base">{content}</p>
  </div>
);


export default CalculatorSection;