//Validator object
function Validator (options) {

    var selectorRules = {};


    function validate (inputElement, rule) {


        var errorMess;
        var errorElement = inputElement.parentElement.querySelector(options.errorSelector);

        //Lấy ra các rules của selector
        var rules = selectorRules[rule.selector];

        //Lặp qua từng rule và kiểm tra
        for(var i = 0; i < rules.length; i ++) {
            errorMess = rules[i](inputElement.value);

            //Nếu có lỗi thì dừng kiểm tra
            if(errorMess)
                break;
        }
        if(errorMess) {

            errorElement.innerText = errorMess;
            inputElement.parentElement.classList.add('invalid');
        }
        else{

            errorElement.innerText = '';
            inputElement.parentElement.classList.remove('invalid');
        }
        return !errorMess; // Nếu có lỗi trả về false
    }

    var formElement = document.querySelector(options.form);
    if(formElement) {
        
        //Khi submit
            formElement.onsubmit = function (e) {
                e.preventDefault();
                
                var isFormValid = true;

        //Lặp qua từng rule và validate

        options.rules.forEach(rule => {
            var inputElement = formElement.querySelector(rule.selector);
            var isValid = validate(inputElement, rule);
            //Nếu có lỗi 
            if(!isValid) {
                isFormValid = false;
            }

        });

        if(isFormValid)
            //Trường hợp submit với JS
            if(typeof options.onSubmit == 'function') {

                //Lấy ra những element có thuộc tính là name và ko có disable
                //Ở đây trả về node list
                var enableInputs = formElement.querySelectorAll('[name]:not([disable])');

                //Convert node list => array
                var formValue = Array.from(enableInputs).reduce( function (values, input) {
                    return (values[input.name] = input.value) && values;    
                }, {});
                options.onSubmit(formValue);
            } 
            //Trường hợp submit mặt định
            else {
                formElement.onSubmit();
            }
    }
        //Lặp qua mỗi rule và xử lí
        options.rules.forEach(rule => {

            //Lưu lại các rules cho mỗi inout
            if (Array.isArray(selectorRules[rule.selector])){

                selectorRules[rule.selector].push(rule.test);

            } else {

                selectorRules[rule.selector] = [rule.test]; 
            }
            

            var inputElement = formElement.querySelector(rule.selector);

            if(inputElement) {
                 //Xử lí trường hợp blur ra ngoài
                inputElement.addEventListener('blur', function () {
                   
                    validate(inputElement, rule);
                });

                //Xữ lí mỗi khi người dùng nhập vào input
                inputElement.addEventListener('click', function () {

                    var errorElement = 
                    inputElement.parentElement.querySelector(options.errorSelector);

                    errorElement.innerText = '';
                    inputElement.parentElement.classList.remove('invalid');
                });
            }
        });             
    }
}

// Define rules
// Nguyên tắc của các rule
    //1. Khi có lỗi thì trả ra mess lỗi
    //2. Khi không có lỗi thì không trả ra gì cả
Validator.isRequirement = function (selector, message) {
    return {
        selector: selector,
        test: function (value) {
            
            return value.trim() ? undefined : message || 'Vui lòng nhập trường này';
        }
    };
}
Validator.isEmail = function (selector, message) {
    return {
        selector: selector,
        test: function (value) {
            var regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
            return regex.test(value) ? undefined : message || 'Trường này phải là email';
        }
    };
}

Validator.isPassword = function (selector, min, message) {
    return {
        selector: selector,
        test: function (value) {

            return value.length >= min ? undefined : message || `Vui lòng nhập ít nhất ${min} kí tự`;
        }
    }
}

Validator.confirmPassword = function (selector, getPassword, message) {
    return {
        selector: selector,
        test: function (value) {

            return value === getPassword() ? undefined : message || `Gía trị nhập vào không chính xác`;
        }
    }
}