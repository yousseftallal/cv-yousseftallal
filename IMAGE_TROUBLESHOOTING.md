# دليل استكشاف الأخطاء - مشاكل الصور

## 🖼️ المشاكل الشائعة وحلولها

### 1. الصور لا تُحفظ

#### الأعراض:
- الصور تُرفع وتظهر في المعاينة
- لكن تختفي عند إعادة تحميل الصفحة
- لا تظهر في البيانات المحفوظة

#### الحلول:
1. **تحقق من localStorage**:
   ```javascript
   // في وحدة التحكم
   console.log(localStorage.getItem('cvDashboardData'));
   ```

2. **تحقق من مساحة التخزين**:
   - الصور تُحفظ كـ base64 (حجم كبير)
   - قد تتجاوز حد localStorage (5-10MB)

3. **تحقق من أذونات localStorage**:
   - جرب في وضع التصفح الخاص
   - تحقق من إعدادات المتصفح

### 2. لا يمكن حذف الصور

#### الأعراض:
- أزرار الحذف لا تعمل
- الصور تبقى في القائمة
- رسائل خطأ في وحدة التحكم

#### الحلول:
1. **تحقق من وجود الصورة في البيانات**:
   ```javascript
   // في وحدة التحكم
   const data = JSON.parse(localStorage.getItem('cvDashboardData'));
   console.log(data.images);
   ```

2. **تحقق من أزرار الحذف**:
   ```javascript
   // في وحدة التحكم
   document.querySelectorAll('.btn-danger').forEach(btn => {
       console.log(btn.onclick);
   });
   ```

3. **حذف يدوي**:
   ```javascript
   // حذف صورة محددة
   const data = JSON.parse(localStorage.getItem('cvDashboardData'));
   data.images = data.images.filter(img => img.id !== 'IMAGE_ID');
   localStorage.setItem('cvDashboardData', JSON.stringify(data));
   ```

### 3. الصور لا تظهر في الـ CV

#### الأعراض:
- الصور محفوظة في الداشبورد
- لكن لا تظهر في صفحة الـ CV
- صورة البروفايل لا تتحدث

#### الحلول:
1. **تحقق من تحميل البيانات**:
   ```javascript
   // في وحدة التحكم
   loadDashboardData();
   ```

2. **تحقق من صورة البروفايل**:
   ```javascript
   // في وحدة التحكم
   const data = JSON.parse(localStorage.getItem('cvDashboardData'));
   const profileImage = data.images.find(img => img.isProfile);
   console.log(profileImage);
   ```

3. **تحديث يدوي**:
   ```javascript
   // تحديث صورة البروفايل
   const profileImg = document.querySelector('.profile-img');
   if (profileImg) {
       profileImg.src = 'URL_OF_PROFILE_IMAGE';
   }
   ```

### 4. مشاكل في رفع الصور

#### الأعراض:
- لا يمكن اختيار الملفات
- رسائل خطأ عند الرفع
- الملفات لا تُقرأ

#### الحلول:
1. **تحقق من نوع الملف**:
   - تأكد من أن الملف صورة (jpg, png, gif, etc.)
   - تحقق من حجم الملف (أقل من 5MB)

2. **تحقق من FileReader**:
   ```javascript
   // اختبار FileReader
   const file = document.getElementById('imageUpload').files[0];
   if (file) {
       const reader = new FileReader();
       reader.onload = function(e) {
           console.log('File read successfully:', e.target.result.substring(0, 100));
       };
       reader.readAsDataURL(file);
   }
   ```

3. **تحقق من أذونات الملفات**:
   - تأكد من أن المتصفح يسمح بالوصول للملفات
   - جرب في متصفح آخر

## 🧪 اختبار إدارة الصور

### صفحة الاختبار
```
https://your-site.netlify.app/test-images.html
```

### خطوات الاختبار:
1. **تحميل الصور الحالية**
2. **إضافة صورة تجريبية**
3. **تعيين صورة كبروفايل**
4. **حذف صورة**
5. **رفع صور حقيقية**

## 🔧 إصلاحات سريعة

### إعادة تعيين الصور
```javascript
// مسح جميع الصور
const data = JSON.parse(localStorage.getItem('cvDashboardData'));
data.images = [];
localStorage.setItem('cvDashboardData', JSON.stringify(data));
```

### إضافة صورة افتراضية
```javascript
// إضافة صورة افتراضية
const data = JSON.parse(localStorage.getItem('cvDashboardData'));
data.images = [{
    id: 'default',
    src: 'https://via.placeholder.com/300x300/4A90E2/FFFFFF?text=YT',
    name: 'Default Profile',
    type: 'default',
    isDefault: true,
    isProfile: true
}];
localStorage.setItem('cvDashboardData', JSON.stringify(data));
```

### تصحيح صورة البروفايل
```javascript
// تعيين صورة كبروفايل
const data = JSON.parse(localStorage.getItem('cvDashboardData'));
if (data.images && data.images.length > 0) {
    data.images.forEach(img => img.isProfile = false);
    data.images[0].isProfile = true;
    localStorage.setItem('cvDashboardData', JSON.stringify(data));
}
```

## 📋 خطوات التشخيص

### الخطوة 1: فحص البيانات
```javascript
// تحقق من وجود بيانات الصور
const data = localStorage.getItem('cvDashboardData');
if (data) {
    const parsed = JSON.parse(data);
    console.log('Images:', parsed.images);
    console.log('Profile image:', parsed.images?.find(img => img.isProfile));
}
```

### الخطوة 2: اختبار الرفع
```javascript
// اختبار رفع صورة
const fileInput = document.createElement('input');
fileInput.type = 'file';
fileInput.accept = 'image/*';
fileInput.onchange = function(e) {
    const file = e.target.files[0];
    if (file) {
        console.log('File selected:', file.name, file.size);
        const reader = new FileReader();
        reader.onload = function(e) {
            console.log('File read successfully');
        };
        reader.readAsDataURL(file);
    }
};
fileInput.click();
```

### الخطوة 3: اختبار الحفظ
```javascript
// اختبار حفظ صورة
const testImage = {
    id: 'test_' + Date.now(),
    src: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
    name: 'Test Image',
    type: 'test',
    isDefault: false,
    isProfile: false
};

const data = JSON.parse(localStorage.getItem('cvDashboardData') || '{}');
if (!data.images) data.images = [];
data.images.push(testImage);
localStorage.setItem('cvDashboardData', JSON.stringify(data));
console.log('Test image saved');
```

## 🚨 رسائل الخطأ الشائعة

### "QuotaExceededError"
- **السبب**: تجاوز حد localStorage
- **الحل**: حذف صور قديمة أو تقليل حجم الصور

### "FileReader not supported"
- **السبب**: المتصفح لا يدعم FileReader
- **الحل**: استخدم متصفح حديث

### "Permission denied"
- **السبب**: لا توجد أذونات للوصول للملفات
- **الحل**: تحقق من إعدادات المتصفح

## 📞 الحصول على المساعدة

إذا لم تحل المشكلة:
1. استخدم صفحة اختبار الصور
2. التقط لقطة شاشة من وحدة التحكم
3. اكتب رسائل الخطأ بالكامل
4. وصف الخطوات التي أدت إلى المشكلة