# 🚀 تعليمات النشر السريع

## الطريقة الأولى: النشر التلقائي (الأسهل)

### 1. إعداد GitHub Actions
```bash
# 1. ارفع الكود إلى GitHub
git add .
git commit -m "Add auto-deploy setup"
git push origin main

# 2. اذهب إلى GitHub Repository Settings
# 3. اذهب إلى Secrets and variables > Actions
# 4. أضف هذه المتغيرات:
#    - NETLIFY_AUTH_TOKEN: احصل عليه من Netlify
#    - NETLIFY_SITE_ID: احصل عليه من Netlify
```

### 2. الحصول على Netlify Tokens
```bash
# 1. اذهب إلى Netlify Dashboard
# 2. اذهب إلى User Settings > Applications > Personal access tokens
# 3. أنشئ token جديد
# 4. انسخ NETLIFY_SITE_ID من Site Settings
```

## الطريقة الثانية: النشر اليدوي السريع

### باستخدام Netlify CLI
```bash
# تثبيت Netlify CLI
npm install -g netlify-cli

# تسجيل الدخول
netlify login

# النشر
npm run deploy
```

### باستخدام السكريبت
```bash
# جعل السكريبت قابل للتنفيذ
chmod +x deploy.sh

# تشغيل النشر
./deploy.sh
```

## الطريقة الثالثة: النشر من Terminal

### أوامر سريعة
```bash
# إعداد المشروع
npm run setup

# النشر للإنتاج
npm run deploy

# النشر للمعاينة
npm run deploy:preview
```

## إعدادات Netlify

### 1. ربط GitHub Repository
1. اذهب إلى Netlify Dashboard
2. اضغط "New site from Git"
3. اختر GitHub
4. اختر repository
5. اضبط الإعدادات:
   - Build command: `npm run build`
   - Publish directory: `.`
   - Base directory: (اتركه فارغ)

### 2. إعداد Environment Variables
```bash
# في Netlify Dashboard > Site Settings > Environment variables
DATABASE_URL = postgresql://neondb_owner:npg_wBxuRO8jN7KX@ep-wild-shadow-aej6461z-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

### 3. إعداد Auto-deploy
- في Netlify Dashboard > Site Settings > Build & deploy
- تأكد من تفعيل "Auto-deploy"

## أوامر سريعة للنشر

```bash
# النشر السريع
npm run deploy

# النشر مع رسالة
git add . && git commit -m "Update content" && git push

# إعادة نشر
netlify deploy --prod --dir=.

# معاينة التغييرات
npm run deploy:preview
```

## مراقبة النشر

### 1. GitHub Actions
- اذهب إلى GitHub Repository > Actions
- راقب حالة النشر

### 2. Netlify Dashboard
- اذهب إلى Netlify Dashboard > Deploys
- راقب حالة النشر

### 3. Terminal
```bash
# مراقبة النشر
netlify status

# سجل النشر
netlify logs
```

## استكشاف الأخطاء

### إذا فشل النشر:
```bash
# 1. تحقق من الأخطاء
netlify logs

# 2. أعد النشر
npm run deploy

# 3. تحقق من Environment Variables
netlify env:list
```

### إذا لم تظهر التغييرات:
```bash
# 1. امسح الكاش
netlify deploy --prod --dir=. --force

# 2. تحقق من الإعدادات
netlify status
```

## نصائح سريعة

1. **النشر التلقائي**: استخدم GitHub Actions
2. **النشر السريع**: استخدم `npm run deploy`
3. **المعاينة**: استخدم `npm run deploy:preview`
4. **مراقبة**: راقب Netlify Dashboard

## روابط مفيدة

- [Netlify CLI Documentation](https://docs.netlify.com/cli/get-started/)
- [GitHub Actions for Netlify](https://github.com/nwtgck/actions-netlify)
- [Netlify Environment Variables](https://docs.netlify.com/environment-variables/get-started/)