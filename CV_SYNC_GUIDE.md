# دليل الربط بين الداشبورد والـ CV

## 🔗 المشكلة
التغييرات في الداشبورد لا تظهر في صفحة الـ CV الرئيسية.

## ✅ الحل المطبق

### 1. تحديث الصفحة الرئيسية
- تم تحديث `script.js` لقراءة البيانات من localStorage
- إضافة دالة `loadDashboardData()` لتحميل البيانات
- إضافة دالة `updatePageWithData()` لتحديث الصفحة

### 2. نظام التحديث التلقائي
- مراقبة التغييرات في localStorage
- إرسال أحداث مخصصة عند حفظ البيانات
- فحص دوري للتحديثات (كل ثانيتين)

### 3. تحديث جميع الأقسام
- **المعلومات الشخصية**: الاسم، الوظيفة، البريد الإلكتروني، الهاتف، الموقع
- **المهارات**: تحديث قائمة المهارات وعددها
- **الخبرات**: تحديث قائمة الخبرات والمشاريع
- **التعليم**: تحديث المؤهلات التعليمية
- **معلومات الاتصال**: تحديث بيانات التواصل
- **Footer**: تحديث اسم المالك

## 🧪 اختبار الربط

### صفحة الاختبار
```
https://your-site.netlify.app/test-cv-sync.html
```

### خطوات الاختبار
1. **افتح صفحة اختبار الربط**
2. **اضغط "Update Personal Info"**
3. **افتح صفحة الـ CV في تبويب آخر**
4. **تأكد من ظهور التغييرات تلقائياً**

### اختبارات إضافية
- تحديث المهارات
- تحديث الخبرات
- تحديث التعليم
- اختبار التزامن بين التبويبات

## 🔧 كيفية عمل النظام

### 1. حفظ البيانات في الداشبورد
```javascript
// في الداشبورد
localStorage.setItem('cvDashboardData', JSON.stringify(data));
localStorage.setItem('cvDataTimestamp', Date.now().toString());
window.dispatchEvent(new CustomEvent('cvDataUpdated'));
```

### 2. قراءة البيانات في الـ CV
```javascript
// في الـ CV
function loadDashboardData() {
    const savedData = localStorage.getItem('cvDashboardData');
    if (savedData) {
        const data = JSON.parse(savedData);
        updatePageWithData(data);
    }
}
```

### 3. مراقبة التغييرات
```javascript
// مراقبة التغييرات في localStorage
window.addEventListener('storage', function(e) {
    if (e.key === 'cvDashboardData' || e.key === 'cvDataTimestamp') {
        loadDashboardData();
    }
});

// مراقبة الأحداث المخصصة
window.addEventListener('cvDataUpdated', function() {
    loadDashboardData();
});
```

## 🚨 استكشاف الأخطاء

### إذا لم تظهر التغييرات:

#### 1. تحقق من localStorage
```javascript
// في وحدة التحكم
console.log(localStorage.getItem('cvDashboardData'));
```

#### 2. تحقق من الأحداث
```javascript
// في وحدة التحكم
window.addEventListener('cvDataUpdated', function() {
    console.log('Event received!');
});
```

#### 3. تحقق من تحميل البيانات
```javascript
// في وحدة التحكم
loadDashboardData();
```

### مشاكل شائعة:

#### 1. البيانات لا تُحفظ
- تحقق من أذونات localStorage
- جرب في وضع التصفح الخاص
- تحقق من مساحة التخزين

#### 2. التغييرات لا تظهر تلقائياً
- تأكد من أن الصفحة تستمع للأحداث
- جرب إعادة تحميل الصفحة
- تحقق من وجود أخطاء JavaScript

#### 3. التزامن بين التبويبات لا يعمل
- تأكد من أن localStorage يعمل
- تحقق من إعدادات المتصفح
- جرب متصفح آخر

## 📋 خطوات التشخيص

### الخطوة 1: فتح وحدة التحكم
1. اضغط `F12`
2. انتقل إلى تبويب `Console`
3. ابحث عن رسائل الخطأ

### الخطوة 2: اختبار البيانات
```javascript
// تحقق من وجود البيانات
localStorage.getItem('cvDashboardData')

// تحميل البيانات يدوياً
loadDashboardData()
```

### الخطوة 3: اختبار الأحداث
```javascript
// إرسال حدث تجريبي
window.dispatchEvent(new CustomEvent('cvDataUpdated'))
```

### الخطوة 4: اختبار التحديث
```javascript
// تحديث البيانات يدوياً
const testData = { personal: { fullName: 'Test User' } };
localStorage.setItem('cvDashboardData', JSON.stringify(testData));
loadDashboardData();
```

## 🔄 إعادة تعيين النظام

إذا فشل كل شيء:
1. امسح localStorage:
   ```javascript
   localStorage.clear();
   ```
2. أعد تحميل جميع الصفحات
3. جرب التحديث من جديد

## 📞 الحصول على المساعدة

إذا لم تحل المشكلة:
1. استخدم صفحة اختبار الربط
2. التقط لقطة شاشة من وحدة التحكم
3. اكتب رسائل الخطأ بالكامل
4. وصف الخطوات التي أدت إلى المشكلة