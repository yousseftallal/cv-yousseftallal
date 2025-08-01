# حل مشكلة صورة البروفايل

## 🖼️ المشكلة
صورة البروفايل تُحفظ في الداشبورد لكن لا تظهر في صفحة الـ CV.

## 🔧 الحلول السريعة

### 1. اختبار سريع
افتح صفحة اختبار صورة البروفايل:
```
https://your-site.netlify.app/test-profile-image.html
```

### 2. تشخيص من وحدة التحكم

#### في صفحة الـ CV، افتح وحدة التحكم (F12) واكتب:

```javascript
// تحقق من البيانات
const data = JSON.parse(localStorage.getItem('cvDashboardData'));
console.log('Images:', data.images);

// تحقق من صورة البروفايل
const profileImage = data.images.find(img => img.isProfile === true);
console.log('Profile image:', profileImage);

// تحديث صورة البروفايل يدوياً
updateProfileImage();
```

### 3. إصلاح يدوي

#### إذا لم توجد صورة بروفايل:
```javascript
// إضافة صورة بروفايل تجريبية
const data = JSON.parse(localStorage.getItem('cvDashboardData'));
if (!data.images) data.images = [];

// إضافة صورة تجريبية
data.images.push({
    id: 'profile_' + Date.now(),
    src: 'https://via.placeholder.com/300x300/4A90E2/FFFFFF?text=Profile',
    name: 'Profile Image',
    type: 'profile',
    isDefault: false,
    isProfile: true
});

localStorage.setItem('cvDashboardData', JSON.stringify(data));

// تحديث الصفحة
loadDashboardData();
```

#### إذا كانت الصورة موجودة لكن لا تظهر:
```javascript
// تحديث صورة البروفايل
updateProfileImage();

// أو إعادة تحميل البيانات
loadDashboardData();
```

## 🧪 خطوات الاختبار

### الخطوة 1: فحص البيانات
1. افتح صفحة الـ CV
2. اضغط F12 لفتح وحدة التحكم
3. اكتب: `console.log(JSON.parse(localStorage.getItem('cvDashboardData')))`
4. تحقق من وجود `images` و `isProfile: true`

### الخطوة 2: اختبار التحديث
1. في وحدة التحكم، اكتب: `updateProfileImage()`
2. تحقق من ظهور الصورة
3. إذا لم تظهر، اكتب: `loadDashboardData()`

### الخطوة 3: اختبار الداشبورد
1. افتح الداشبورد
2. اذهب إلى قسم الصور
3. اضغط "Set as Profile" على صورة
4. تحقق من ظهور علامة "Profile"
5. عد إلى صفحة الـ CV وتأكد من التحديث

## 🚨 مشاكل شائعة

### 1. لا توجد صور في البيانات
```javascript
// إضافة صورة افتراضية
const data = JSON.parse(localStorage.getItem('cvDashboardData') || '{}');
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

### 2. الصورة موجودة لكن `isProfile` خطأ
```javascript
// تصحيح صورة البروفايل
const data = JSON.parse(localStorage.getItem('cvDashboardData'));
data.images.forEach(img => img.isProfile = false);
data.images[0].isProfile = true; // أو اختر الصورة المطلوبة
localStorage.setItem('cvDashboardData', JSON.stringify(data));
```

### 3. الصورة لا تُحمل
```javascript
// اختبار تحميل الصورة
const img = new Image();
img.onload = function() {
    console.log('Image loaded successfully');
    document.querySelector('.profile-img').src = this.src;
};
img.onerror = function() {
    console.error('Image failed to load');
};
img.src = 'URL_OF_IMAGE';
```

## 📋 أوامر التشخيص

### في وحدة التحكم:

```javascript
// فحص البيانات
localStorage.getItem('cvDashboardData')

// فحص الصور
JSON.parse(localStorage.getItem('cvDashboardData')).images

// فحص صورة البروفايل
JSON.parse(localStorage.getItem('cvDashboardData')).images.find(img => img.isProfile)

// تحديث الصورة
updateProfileImage()

// إعادة تحميل البيانات
loadDashboardData()

// فحص عنصر الصورة
document.querySelector('.profile-img')
```

## 🔄 إعادة تعيين كاملة

إذا فشل كل شيء:

```javascript
// مسح جميع البيانات
localStorage.clear();

// إعادة تحميل الصفحة
location.reload();
```

## 📞 الحصول على المساعدة

إذا لم تحل المشكلة:
1. استخدم صفحة اختبار صورة البروفايل
2. التقط لقطة شاشة من وحدة التحكم
3. اكتب رسائل الخطأ بالكامل
4. وصف الخطوات التي أدت إلى المشكلة