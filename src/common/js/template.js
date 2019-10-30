export function getHTML(imgList, zoneList, title = '') {
    let imgStr = '';
    imgList.forEach(item => {
        imgStr += `<img class="image-style" src="${item.thumbUrl}"/>`
    });
    let zoneStr = '';
    zoneList.forEach(item => {
        let str = `<a href="${item.url}" class="hot-zone" style="width:${item.width / 3.75}vw;height:${item.height / 3.75}vw;top:${item.top / 3.75}vw;left:${item.left / 3.75}vw"></a>`;
        if (item.other) {
            str = getStr(item)
        }
        zoneStr += str
    })
    let str = `<!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <title>${title}</title>
                    <style>
                        *{
                            margin:unset;
                            padding:unset;
                            font-size:0;
                        }
                        #wrap{
                            display: flex;
                            width:100%;
                            height:100%;
                        }
                        .content{
                            position: relative;
                            width:100%;
                        }
                        .image-style{
                            width:100%;
                            height:auto;
                            margin-top:-2px;
                        }
                        .hot-zone{
                            display: block;
                            position:absolute;
                            opacity: 0;
                        }
                    </style>
                </head>
                <body>
                <div id="wrap">
                    <div class="content">
                        ${imgStr}
                        ${zoneStr}
                    </div>
                </div>
                </body>
                </html>
`
    console.log(str)
}

let getStr = (item) => {
    if (item.other === 'backToTop') {
        return `<button onclick="gotoTop()" class="hot-zone" style="width:${item.width / 3.75}vw;height:${item.height / 3.75}vw;top:${item.top / 3.75}vw;left:${item.left / 3.75}vw"></button>
                <script>
                    function scrollAnimation(currentY, targetY) {
                        // 获取当前位置方法
                        // const currentY = document.documentElement.scrollTop || document.body.scrollTop
            
                        // 计算需要移动的距离
                        let needScrollTop = targetY - currentY
                        let _currentY = currentY
                        setTimeout(() => {
                            // 一次调用滑动帧数，每次调用会不一样
                            const dist = Math.ceil(needScrollTop / 30)
                            _currentY += dist
                            window.scrollTo(_currentY, currentY)
                            // 如果移动幅度小于十个像素，直接移动，否则递归调用，实现动画效果
                            if (needScrollTop > 31 || needScrollTop < -31) {
                                scrollAnimation(_currentY, targetY)
                            } else {
                                window.scrollTo(_currentY, targetY)
                            }
                        }, 1)
                    }
                    function gotoTop(){
                        const currentY = document.documentElement.scrollTop || document.body.scrollTop
                        scrollAnimation(currentY, 0)
                    }
                </script>`
    }
}
