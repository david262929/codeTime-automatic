try {
    siteProduct;
} catch (error) {
    alert('Нет Объекта siteProduct')
}
if (siteProduct) {
    var xhr = new XMLHttpRequest(),
        currentProdCountries = [],
        rusPrice,
        response,
        _data,
        inputMask;

    xhr.open('GET', '//click.lucky.online/click/ip-location.html', false);
    xhr.send();

    if (xhr.status === 200) {
        response = JSON.parse(xhr.responseText);
    }

    if (siteProduct.demonPopup) {
        var demonPopupTitle = 'Подождите! У нас есть для Вас предложение';

        if (response.city !== null) {
            demonPopupTitle = 'Вы из города ' + response.city + '? Подождите!';
        }
        $('head').append('<link rel="stylesheet" href="css/generator.css">');
        $('body').append('<div class="demon_popup">\n' +
            '        <div class="demon_overflow"></div>\n' +
            '        <div class="demon_popup_body">\n' +
            '            <span class="demon_close"></span>\n' +
            '            <h4 class="demon_popup_title">' + demonPopupTitle + '</h4>\n' +
            '            <img src="img/product.png" alt="" style="width:28%">\n' +
            '            <p>Для Вас ещё действует специальное ограниченное предложение</p>\n' +
            '            <p>Успейте принять участие в программе и получите "' + siteProduct.name + '" по акции <span class="new_price_val"></span> <span class="new_price_cur"></span><span style="color:#fff !important"> !</span></p>\n' +
            '            <a href="javascript:void(0)" class="popup_btn">узнать подробнее</a>\n' +
            '        </div>\n' +
            '    </div>');
        var closeElems = document.querySelectorAll('.demon_overflow, .demon_close'),
            demonPopup = document.getElementsByClassName('demon_popup')[0];
        for (let i = 0; i < closeElems.length; i++) {
            closeElems[i].onclick = function () {
            }
        }

        var flag = true;

        $(window).mouseout(function (e) {
            if (e.pageY - $(window).scrollTop() < 1 && flag == true) {
                demonPopup.classList.add('active');
            }
        });

        $(".demon_close").on("click", function () {
            demonPopup.classList.remove('active');
        })
    }
}





