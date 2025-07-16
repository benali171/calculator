const calculator = document.querySelector('.calculator');
const keys = calculator.querySelector('.calculator-keys');
const display = calculator.querySelector('.calculator-screen');

let firstValue = '';        // يخزن الرقم الأول في العملية
let operator = '';          // يخزن العملية الحسابية (+, -, *, /)
let secondValue = '';       // يخزن الرقم الثاني في العملية
let result = '';            // يخزن نتيجة الحساب
let shouldResetScreen = false; // لتحديد ما إذا كان يجب مسح الشاشة للرقم الجديد

keys.addEventListener('click', e => {
    if (e.target.matches('button')) {
        const key = e.target;
        const keyContent = key.textContent;
        const displayedNum = display.value; // القيمة الحالية المعروضة على الشاشة

        // 1. التعامل مع الأرقام والنقطة العشرية
        // تحقق مما إذا كان الزر ليس عامل تشغيل وليس زر مسح وليس زر يساوي
        if (!key.classList.contains('operator') && !key.classList.contains('all-clear') && !key.classList.contains('equal-sign')) {
            if (shouldResetScreen) {
                // إذا كان يجب إعادة تعيين الشاشة (بعد عملية أو =)
                display.value = keyContent;
                shouldResetScreen = false;
            } else {
                // إذا كانت الشاشة تعرض '0' أو فارغة، استبدلها بالرقم الجديد.
                // وإلا، أضف الرقم الجديد إلى ما هو موجود.
                // هذا الجزء يبدو صحيحًا لجمع الأرقام على الشاشة.
                if (displayedNum === '0' && keyContent !== '.') { // منع 0000 أو 0123
                    display.value = keyContent;
                } else if (keyContent === '.' && displayedNum.includes('.')) {
                    // منع إضافة أكثر من نقطة عشرية واحدة
                    return;
                } else {
                    display.value = displayedNum + keyContent;
                }
            }
        }

        // 2. التعامل مع العمليات الحسابية (+, -, *, /)
        // إذا كان الزر عامل تشغيل وليس زر '='
        if (key.classList.contains('operator') && key.value !== '=') {
            // إذا كان هناك بالفعل قيمة أولى وعملية سابقة ولم يتم إعادة تعيين الشاشة
            // هذا يعني أن المستخدم يريد إجراء عملية متتالية (مثال: 5 + 3 +)
            if (firstValue && operator && !shouldResetScreen) {
                secondValue = displayedNum; // الرقم الثاني هو ما يظهر على الشاشة حاليًا
                result = calculate(firstValue, operator, secondValue);
                display.value = result; // عرض النتيجة المؤقتة
                firstValue = result; // جعل النتيجة هي الرقم الأول للعملية التالية
            } else {
                // إذا كانت هذه هي العملية الأولى أو بعد مسح الشاشة
                firstValue = displayedNum; // الرقم الأول هو ما يظهر على الشاشة
            }
            operator = key.value; // تخزين العملية الجديدة
            shouldResetScreen = true; // يجب مسح الشاشة عند إدخال الرقم التالي
        }

        // 3. التعامل مع مسح الكل (AC)
        if (key.classList.contains('all-clear')) {
            firstValue = '';
            operator = '';
            secondValue = '';
            result = '';
            display.value = '0'; // إعادة الشاشة إلى الصفر
            shouldResetScreen = false;
        }

        // 4. التعامل مع علامة يساوي (=)
        if (key.classList.contains('equal-sign')) {
            // تأكد من وجود قيمة أولى وعملية
            if (firstValue && operator) {
                secondValue = displayedNum; // الرقم الثاني هو ما يظهر على الشاشة
                result = calculate(firstValue, operator, secondValue);
                display.value = result; // عرض النتيجة النهائية
                firstValue = result; // استمر في استخدام النتيجة لعمليات لاحقة (إذا أراد المستخدم متابعة الحساب)
                operator = ''; // مسح العملية بعد المساواة
                shouldResetScreen = true; // يجب مسح الشاشة عند إدخال رقم جديد بعد النتيجة
            }
        }
    }
});

// دالة الحساب الرئيسية
function calculate(n1, operator, n2) {
    // الأهم: تأكد أن n1 و n2 يتم تحويلهما إلى أرقام بشكل صحيح.
    // إذا كانت parseFloat() ترجع NaN (ليس رقمًا)، فإن أي عملية حسابية ستفشل أو تعطي 0.
    const num1 = parseFloat(n1);
    const num2 = parseFloat(n2);

    // إضافة بعض التحقق لمعرفة ما إذا كانت القيم أرقامًا صالحة
    if (isNaN(num1) || isNaN(num2)) {
        console.error("Invalid number input for calculation:", n1, n2);
        return "Error"; // أو أي رسالة خطأ أخرى
    }

    let calculation = 0;

    if (operator === '+') {
        calculation = num1 + num2;
    } else if (operator === '-') {
        calculation = num1 - num2;
    } else if (operator === '*') {
        calculation = num1 * num2;
    } else if (operator === '/') {
        if (num2 === 0) {
            return "Error: Division by zero";
        }
        calculation = num1 / num2;
    }
    // التأكد من أن النتيجة يتم تحويلها إلى سلسلة نصية للعرض
    return calculation.toString();
}
