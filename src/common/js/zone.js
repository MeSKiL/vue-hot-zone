export class Zone {
    constructor({zoneId,left, top, right = null, bottom = null, width = 0, height = 0, url = '',remark=''}) {
        this.left = left;
        this.top = top;
        this.right = right;
        this.bottom = top;
        this.width = width;
        this.height = height;
        this.url = url;
        this.move = false;
        this.resizeType = '';
        this.zoneId = Math.random(1)*100000000|1;
        this.remark = ''
    }

    movePos(left, top) {
        this.left += left;
        this.top += top;
    }

    resize(x, y) {
        if(this.resizeType==='mt'){ // 上
            if(this.resizeMT){
                this.resizeMT(x,y)
            }else{
                Zone.prototype.resizeMT.call(this,x,y)
            }
        }
        if(this.resizeType==='mb'){ // 下
            if(this.resizeMB){
                this.resizeMB(x,y)
            }else{
                Zone.prototype.resizeMB.call(this,x,y)
            }
        }
        if(this.resizeType==='lm'){ // 左
            if(this.resizeLM){
                this.resizeLM(x,y)
            }else{
                Zone.prototype.resizeLM.call(this,x,y)
            }
        }

        if(this.resizeType==='rm'){ // 右
            if(this.resizeRM){
                this.resizeRM(x,y)
            }else{
                Zone.prototype.resizeRM.call(this,x,y)
            }
        }

        if(this.resizeType==='rb'){ // 右下
            if(this.resizeRM&&this.resizeMB){
                this.resizeRM(x,y);
                this.resizeMB(x,y)
            }else{
                Zone.prototype.resizeRM.call(this,x,y)
                Zone.prototype.resizeMB.call(this,x,y)
            }
        }

        if(this.resizeType==='rt'){ // 右上
            if(this.resizeRM&&this.resizeMT){
                this.resizeRM(x,y);
                this.resizeMT(x,y)
            }else{
                Zone.prototype.resizeRM.call(this,x,y)
                Zone.prototype.resizeMT.call(this,x,y)
            }
        }
        if(this.resizeType==='lb'){ // 左下
            if(this.resizeLM&&this.resizeMB){
                this.resizeLM(x,y);
                this.resizeMB(x,y)
            }else{
                Zone.prototype.resizeLM.call(this,x,y)
                Zone.prototype.resizeMB.call(this,x,y)
            }
        }
        if(this.resizeType==='lt'){ // 左上
            if(this.resizeLM&&this.resizeMT){
                this.resizeLM(x,y);
                this.resizeMT(x,y)
            }else{
                Zone.prototype.resizeLM.call(this,x,y)
                Zone.prototype.resizeMT.call(this,x,y)
            }
        }
    }

    resizeMT(x,y){ // 上
        if(this.height<=0&&y>0)return;
        this.top += y;
        this.height -= y;
    }

    resizeMB(x,y){ // 下
        this.height += y;
    }

    resizeLM(x,y){ // 左
        if(this.width<=0&&x>0)return;
        this.left += x;
        this.width -= x;
    }

    resizeRM(x,y){ // 右
        this.width += x;
    }
}

export default function createZone(config) {
    return new Zone(config)
}
