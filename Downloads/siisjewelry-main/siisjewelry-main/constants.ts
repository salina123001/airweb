import { Product } from './types';

export const NAV_LINKS = [
  { href: '#', label: '首頁' },
  { href: '#products', label: '產品' }, // ✅ 改成滾動到首頁產品區塊
  { href: '#about', label: '關於我們' },
  { href: '#contact', label: '聯繫我們' },
];

export const INTERACTIVE_EXPERIENCES = [
  { 
    title: '自己設計手串', 
    description: '發揮您的創意，親手搭配設計出獨一無二的能量水晶手串。',
    image: 'https://picsum.photos/id/1011/600/400',
    url: 'https://salina123001.github.io/bead-designer/' 
  },
  { 
    title: 'AI流年運勢', 
    description: '結合古老智慧與現代AI，為您解析流年運勢，找到您的守護水晶。',
    image: 'https://picsum.photos/id/10/600/400',
    url: 'https://richweb-black.vercel.app/' 
  },
  { 
    title: '水晶快手遊戲', 
    description: '考驗您的眼力與速度，在充滿樂趣的遊戲中認識更多美麗水晶。',
    image: 'https://picsum.photos/id/102/600/400',
    url: 'https://salina123001.github.io/crystal-game/' 
  }
];

export const FEATURES = [
  { icon: 'fa-certificate', title: '100% 純天然水晶', description: '我們承諾所有水晶產品均為天然材質，未經人工染色或處理，保留其原始能量與美感。' },
  { icon: 'fa-globe', title: '全球精選', description: '從巴西的紫水晶到馬達加斯加的孔雀石，我們精心挑選來自世界各地的優質水晶資源。' },
  { icon: 'fa-heart', title: '能量加持', description: '每件水晶飾品都經過專業淨化與能量激活，為您帶來身心平衡與積極能量。' }
];
