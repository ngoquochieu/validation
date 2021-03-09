//Validator object
function Validator (options) {

    function validate (inputElement, rule) {

        var errorMess = rule.test(inputElement.value);
        var errorElement = inputElement.parentElement.querySelector(options.errorSelector);

        if(errorMess) {

            errorElement.innerText = errorMess;
            inputElement.parentElement.classList.add('invalid');
        }
        else{

            errorElement.innerText = '';
            inputElement.parentElement.classList.remove('invalid');
        }
    }

    var formElement = document.querySelector(options.form);

    if(formElement) {

        options.rules.forEach(rule => {

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
Validator.isRequirement = function (selector) {
    return {
        selector: selector,
        test: function (value) {
            
            return value.trim() ? undefined : 'Vui lòng nhập trường này';
        }
    };
}
Validator.isEmail = function (selector) {
    return {
        selector: selector,
        test: function (value) {
            var regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
            return regex.test(value) ? undefined : 'Trường này phải là email';
        }
    };
}

Validator.isPassword = function (selector, min) {
    return {
        selector: selector,
        test: function (value) {
            return value.length >= min ? undefined : `Vui lòng nhập ít nhất ${min} kí tự`;
        }
    }
}