var fs = require('fs');
var fock = require('child_process').fork;

if (!fs.existsSync('images')) {
    fs.mkdirSync('images');
}

// 从第几页开始
var pageNo = 1;

// 创建爬虫进程
var startSpider = (pageNo) => {
    var spider = fock('spider', [pageNo]);
    // 判断是否是子进程主动退出
    var exit = false;
    
    // 接收子进程发送的消息
    // type 定义
    // 0 更新页码
    // 2 已爬取完毕
    spider.on('message', (code) => {
        var type = code.type;
        switch (type) {
            case 0:
                pageNo = code.pageNo;
                console.log('当前page:' + pageNo);
                break;
            case 1:
                break;
            case 2:
                exit = true;
                console.log('处理完成');
                break;
            default:
                console.log('怎么会到这里的？');
                break;
        }
    });

    spider.on('exit', (args) => {
        // 重新启动进程
        if (!exit) {
            startSpider(pageNo);
        }
    });
};

startSpider(pageNo);