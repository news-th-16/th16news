vex.defaultOptions.className = 'vex-theme-default';

$(document).ready(() => {
    // $('#submit-button').on('click', (e) => {
    //     console.log('asdasdasd')
    // })
    // vex.dialog.confirm({
    //     message: 'Are you absolutely sure you want to destroy the alien planet?',
    //     callback: function (value) {
    //         if (value) {
    //             console.log('Successfully destroyed the planet.')
    //         } else {
    //             console.log('Chicken.')
    //         }
    //     }
    // })
     
    $('#submit-button').on('click', (e) => {
        e.preventDefault();
        $.ajax({
            type: "POST",
            url: '/changeinfo',
            data: $('#my-form').serialize(),
            success: (res) => {
                vex.dialog.open({
                    message:"Cap nhat thanh cong",
                    buttons: [
                        $.extend({}, vex.dialog.buttons.YES, { text: 'Ok' }),
                    ],
                    callback: (data) => {
                        location.reload();
                    }
                })
            }
        })
    })

    $('#upgrade-button').on('click', (e) => {
        vex.dialog.open({
            message: "Bạn chấp nhận thanh toán để nâng cấp 7 ngày sử dụng gói Premium ? Nhập vào chữ 'Yes' để xác nhận !",
            input: [
                '<input id="isOk" name="isOk" type="text" placeholder="Nhập `Yes` vào đây" required />',
            ].join(''),
            buttons: [
                $.extend({}, vex.dialog.buttons.YES, { text: 'Chấp nhận' }),
                $.extend({}, vex.dialog.buttons.NO, { text: 'Hủy bỏ' }),
            ],
            callback: (data) => {
                if(data) {
                    $.ajax({
                        url: '/upgrade',
                        method: 'POST',
                        data: data,
                        success: (res) => {
                            vex.dialog.open({
                                message:"Nâng cấp thành công",
                                buttons: [
                                    $.extend({}, vex.dialog.buttons.YES, { text: 'Ok' }),
                                ],
                                callback: (data) => {
                                    location.reload();
                                }
                            })
                        }
                    })
                }
            }
        })
    })
})