var keystone = require('keystone');
var url = require('url');

exports = module.exports = function(req, res) {

    var view = new keystone.View(req, res);
    var locals = res.locals;

    var url_parts = url.parse(req.url, true);

    var all = unescape(url_parts.query.all);
    all = all.replace(/['"']/g, '');
    locals.query = all;
    console.log('--all', all);

    // locals.section is used to set the currently selected
    // item in the header navigation.
    locals.section = 'contest';
    locals.title = 'Конкурс';

    // let worker = require('child_process').fork(__dirname + '/../vk_get_video.js', { silent: true, execPath: 'node' });

    // worker.on('error', (err) => {
    //     console.error('worker err: ', err);
    // });

    // worker.on('close', (code) => {
    //     console.log('Close worker code: ', code);
    //     view.render('contest');
    // });

    // worker.on('message', (msg) => {
    //     // console.log('Worker msg: ', msg);

    //     try {
    //         let video = JSON.parse(msg);

    //         if ('links' in video) {
    //             if (all == 1) {
    //                 video['links'].forEach((item) => {
    //                     if (item) {
    //                         locals.video.push(item);
    //                     }
    //                 });
    //             } else {
    //                 if (Array.isArray(video['links'])) {
    //                     locals.video = video['links'].slice(-9);
    //                 }
    //                 locals.btnAllVideo = true;
    //             }
    //         }
    //         console.log('**** locals.video: ', locals.video);
    //     } catch (err) {
    //         console.log(err);
    //     }
    // });

    locals.video = [
        'https://www.youtube.com/embed/EsaeECjCGZI?__ref=vk.api',
        'https://www.youtube.com/embed/2bGHD_Bca4k?__ref=vk.api',
        'https://vk.com/video_ext.php?oid=-154629793&id=456239019&hash=e77433eb6328c668&__ref=vk.api&api_hash=1515657827d1df29995d0cef72d2_GQ2DCNBWGE4TKNI',
        'https://vk.com/video_ext.php?oid=-154629793&id=456239018&hash=0b0d62abd32334fd&__ref=vk.api&api_hash=15156578278ad657f291e4ae1ed3_GQ2DCNBWGE4TKNI',
        'https://www.youtube.com/embed/ZGRVXxrAK5Q?__ref=vk.api',
        'https://www.youtube.com/embed/JLOgHIK-yls?__ref=vk.api',
        'https://www.youtube.com/embed/SfuzdIOecDw?__ref=vk.api',
        'https://www.youtube.com/embed/oxeGVsE_Ic0?__ref=vk.api',
        'https://www.youtube.com/embed/Ztw1RUAZNpo?__ref=vk.api',
        'https://www.youtube.com/embed/VF7EDyuwJCs?__ref=vk.api',
        'https://www.youtube.com/embed/7J1gVtvAb28?__ref=vk.api',
        'https://www.youtube.com/embed/Co6dF5eMap4?__ref=vk.api',
        'https://www.youtube.com/embed/kqyGLu98k_s?__ref=vk.api',
        'https://www.youtube.com/embed/aR4SHLho7f4?__ref=vk.api',
        'https://www.youtube.com/embed/I1JKvkNH64I?__ref=vk.api',
        'https://www.youtube.com/embed/q52nwnIanGA?__ref=vk.api',
        'https://www.youtube.com/embed/LO0iPScknHI?__ref=vk.api',
        'https://www.youtube.com/embed/CIB6bKcfKSA?__ref=vk.api',
        'https://www.youtube.com/embed/xkDwILO7ZS8?__ref=vk.api',
        'https://www.youtube.com/embed/dYRSgj8iNS8?__ref=vk.api',
        'https://www.youtube.com/embed/yYcubg9Yg_4?__ref=vk.api',
        'https://www.youtube.com/embed/Lyw2pVK3VWE?__ref=vk.api',
        'https://www.youtube.com/embed/nAJrLDOlPJo?__ref=vk.api',
        'https://www.youtube.com/embed/1TqcIQPXNZ8?__ref=vk.api',
        'https://www.youtube.com/embed/if2Yq5Xr_dE?__ref=vk.api',
        'https://www.youtube.com/embed/C-66aQ5GGgU?__ref=vk.api',
        'https://www.youtube.com/embed/CQG4VUFtPp4?__ref=vk.api',
        'https://www.youtube.com/embed/HRR65HMmG5g?__ref=vk.api',
        'https://www.youtube.com/embed/8FCKw40I6XU?__ref=vk.api',
        'https://www.youtube.com/embed/bxES5LCECmc?__ref=vk.api',
        'https://www.youtube.com/embed/iEP_FIM4QnY?__ref=vk.api',
        'https://www.youtube.com/embed/QHd73OWJZTY?__ref=vk.api',
        'https://www.youtube.com/embed/F84GpSwC6gE?__ref=vk.api',
        'https://www.youtube.com/embed/p3AaEqlMJUU?__ref=vk.api',
        'https://www.youtube.com/embed/AIHMlUeFB3k?__ref=vk.api',
        'https://www.youtube.com/embed/EN7u49JcyqM?__ref=vk.api',
        'https://www.youtube.com/embed/gwxWlJWCAvg?__ref=vk.api',
        'https://www.youtube.com/embed/zt1H8AwWaRQ?__ref=vk.api',
        'https://www.youtube.com/embed/iZazXYu6ua4?__ref=vk.api',
        'https://www.youtube.com/embed/xpLdl9cZjkc?__ref=vk.api',
        'https://www.youtube.com/embed/P0msVnynNJE?__ref=vk.api',
        'https://www.youtube.com/embed/UKt7Q2giCC4?__ref=vk.api',
        'https://www.youtube.com/embed/NZnOg6NyxVU?__ref=vk.api',
        'https://www.youtube.com/embed/ZNarxoZHnSo?__ref=vk.api',
        'https://www.youtube.com/embed/cEDTJ9wN5tQ?__ref=vk.api',
        'https://www.youtube.com/embed/wwqg-eaGSJ4?__ref=vk.api',
        'https://www.youtube.com/embed/X43c9D7pacU?__ref=vk.api',
        'https://www.youtube.com/embed/lb0FAbw6UlA?__ref=vk.api',
        'https://www.youtube.com/embed/vf6hd17T-dY?__ref=vk.api',
        'https://www.youtube.com/embed/i10ypyuOzWU?__ref=vk.api',
        'https://www.youtube.com/embed/t6O9z8SmdIs?__ref=vk.api',
        'https://www.youtube.com/embed/Me49_oKcXD8?__ref=vk.api',
        'https://www.youtube.com/embed/Hj1tzKGykt0?__ref=vk.api',
        'https://www.youtube.com/embed/hKNPwl3V0Sk?__ref=vk.api',
        'https://www.youtube.com/embed/imG-KTwOd8Y?__ref=vk.api',
        'https://www.youtube.com/embed/WE8pfLDHB6E?__ref=vk.api',
        'https://www.youtube.com/embed/iw3sqEjMvuE?__ref=vk.api',
        'https://www.youtube.com/embed/LwE1CRjGp4s?__ref=vk.api',
        'https://www.youtube.com/embed/xk3IiOBxUPY?__ref=vk.api',
        'https://www.youtube.com/embed/H07ZKxoBQxw?__ref=vk.api',
        'https://www.youtube.com/embed/lqHmVziOGJg?__ref=vk.api',
        'https://www.youtube.com/embed/wZPUXQ-PY_o?__ref=vk.api',
        'https://www.youtube.com/embed/JyJTgcTZ4IQ?__ref=vk.api',
        'https://www.youtube.com/embed/EPXOufI0Nh4?__ref=vk.api',
        'https://www.youtube.com/embed/CYWg5nGAGEg?__ref=vk.api',
        'https://www.youtube.com/embed/exGxZs4I0Nc?__ref=vk.api',
        'https://www.youtube.com/embed/vH7LKTCI1ec?__ref=vk.api',
        'https://www.youtube.com/embed/m_Yw8ItuCkY?__ref=vk.api',
        'https://www.youtube.com/embed/BBRDUh5Odhc?__ref=vk.api',
        'https://www.youtube.com/embed/7PJUfD4LIOg?__ref=vk.api',
        'https://www.youtube.com/embed/sJyMjSvH_lw?__ref=vk.api',
        'https://www.youtube.com/embed/3-nMgjtUZWs?__ref=vk.api',
        'https://www.youtube.com/embed/7gkvhS5WMvA?__ref=vk.api',
        'https://www.youtube.com/embed/fjPuKzxi_JM?__ref=vk.api',
        'https://www.youtube.com/embed/Esn6a2WSs4g?__ref=vk.api',
        'https://vk.com/video_ext.php?oid=-154629793&id=456239017&hash=758d3fb558593a66&__ref=vk.api&api_hash=1515657827463c0f7258bccf1941_GQ2DCNBWGE4TKNI'
    ];

    locals.titlevideo = [
        "Воочию",
        "Опрометчивый",
        "Отрада",
        "Подобострастный",
        "Осенить",
        "Обмереть",
        "Учтивый",
        "Ушлый",
        "Юнец",
        "Чреватый",
        "Покладистый",
        "Смятение",
        "Удел",
        "Пресловутый",
        "Витиеватый",
        "Восвояси",
        "Дивный",
        "Зычный",
        "Самородок",
        "Кудесник",
        "Ластиться",
        "Лестный",
        "Марево",
        "Самородок",
        "Горемычный",
        "Гулкий",
        "Отрада",
        "Брюзга",
        "Ворожить",
        "Завзятый",
        "Кабала",
        "Молва",
        "Оплошный",
        "Лихоимство",
        "Косный",
        "Дородный",
        "Голословный",
        "Вздор",
        "Голословный",
        "Вероломный",
        "Оплошность",
        "Обворожительный",
        "Неистовый",
        "Наперсник",
        "Наперсник",
        "Мытарства",
        "Мириады",
        "Экивоки",
        "Фамильярный",
        "Усердие",
        "Топорный",
        "Сумятица",
        "Рачительный",
        "Рачительный",
        "Двужильный",
        "Лютый",
        "Кручиниться",
        "Баснословный",
        "Подспудный",
        "Изувер",
        "Горемычный",
        "Разлад",
        "Жеманный",
        "Несуразный",
        "Докучать",
        "Матёрый",
        "Умопомрачительный",
        "Малодушный",
        "Заискивать",
        "Крамольный",
        "Смекалистый",
        "Витиеватый",
        "Лукавый",
        "Окаянный",
        "Алчный",
        "Краснобай"
    ];

    if (all == 1) {

    } else {
        locals.video = locals.video.slice(-9);
        locals.btnAllVideo = true;
    }

    // Передача параметров!!!!
    // Render the view
    view.render('contest');
};