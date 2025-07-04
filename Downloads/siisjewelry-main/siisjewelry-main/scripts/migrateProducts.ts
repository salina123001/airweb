import { productService } from '../services/firebaseService';
import { PRODUCTS } from '../constants';
import { Timestamp } from 'firebase/firestore';

const migrateProducts = async () => {
  console.log('開始遷移產品資料...');

  for (const product of PRODUCTS) {
    try {
      await productService.addProduct({
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category,
        images: product.images,
        rating: product.rating,
        reviews: product.reviews,
        stock: 100, // 預設庫存
        isActive: true,
        tag: product.tag,
        createdAt: Timestamp.now()
      });
      console.log(`✓ 產品 "${product.name}" 遷移成功`);
    } catch (error) {
      console.error(
        `✗ 產品 "${product.name}" 遷移失敗:`,
        error instanceof Error ? `${error.name}: ${error.message}` : JSON.stringify(error)
      );
    }
  }

  console.log('產品資料遷移完成！');
};

// 執行遷移
try {
  migrateProducts()
    .then(() => {
      console.log('🚀 所有產品遷移流程已執行完畢');
    })
    .catch((err) => {
      console.error(
        '❌ migrateProducts() 發生未預期錯誤：',
        err instanceof Error ? `${err.name}: ${err.message}` : JSON.stringify(err)
      );
    });
} catch (err) {
  console.error(
    '❌ 外層 try/catch 捕捉到錯誤：',
    err instanceof Error ? `${err.name}: ${err.message}` : JSON.stringify(err)
  );
}
