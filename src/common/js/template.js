export function getHTML(imgList, zoneList,title='') {
    let imgStr = '';
    imgList.forEach(item => {
        imgStr+=`<img class="image-style" src="${item.thumbUrl}"/>`
    });
    let zoneStr = '';
    zoneList.forEach(item => {
        zoneStr += `<a href="${item.url}" class="hot-zone" style="width:${item.width/3.75}vw;height:${item.height/3.75}vw;top:${item.top/3.75}vw;left:${item.left/3.75}vw"></a>`
    })
    let str = `<!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <title>${title}</title>
                    <style>
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
                        }
                        .hot-zone{
                            display: block;
                            position:absolute;
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
