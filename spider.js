
var argv = process.argv;

// 获取起始页码
var pageNo = parseInt(argv[2]);

var https = require('https');
var cheerio = require('cheerio')

// 入库
var dao = require('./info-dao');

var fs = require('fs');
var request = require("request");

// 防止下载过快
var mills = 0;

var download = (name, url) => {
    var path = __dirname +'/images/' + name;

    // 已存在就删除
    if (fs.existsSync(path)) {
        fs.unlinkSync(path);
    }

    setTimeout(() => {
        console.log('下载图片:' + url);
        request({
            uri:url,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36'
            }
        }).pipe(fs.createWriteStream(path));

        mills += 1000;
        if (mills >= 10000) {
            mills = 0;
        }
    }, mills);
};

var id = setInterval(() => {
    https.get({
        hostname: 'avio.pw',
        port: 443,
        path:'/cn/actresses/page/' + pageNo,
        method:'GET',
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36'
        }
    }, (res) => {
        var html = '';
        res.setEncoding('utf-8');
        res.on('data', (chunk) => {   
            html += chunk;
        });

        // 开始解析
        var parse = () => {
            var $ = cheerio.load(html);
            var items = $('a.avatar-box.text-center');
            if (items.length < 1) {
                clearInterval(id);
                process.send({ type: 2 });
                return;
            }
            
            items.each(function() {
                var url = $(this).attr('href');
                var photoUrl = $(this).find('.photo-frame img').attr('src');
                var name = $(this).find('.photo-info span').text();
                var tmp = url.split('/');
                // 取出编号
                var id = tmp[tmp.length - 1];
                // 取出后缀名
                tmp = photoUrl.split('.');
                var suffix = tmp[tmp.length - 1];
                var fileName = id + '.' + suffix;
                var info = {
                    id: id,
                    url: url,
                    name: name,
                    photo: photoUrl,
                    local: 'images/' + fileName
                }
                dao.insert(info);
                // 下载图片
                download(fileName, photoUrl);
            });
        }
        res.on('end', () => {
            parse();
        });

    });

    ++pageNo;
    process.send({ type: 0, pageNo: pageNo });
}, 20000);