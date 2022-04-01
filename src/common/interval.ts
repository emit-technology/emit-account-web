import selfStorage from "./storage";

class Interval {

    key: string = "initInterValId"

    interValId: number | undefined

    latestOpTime:number //mills seconds

    constructor(key:string) {
        this.interValId = selfStorage.getItem(this.key)
        this.key = key;
    }

    start(fn: Function, t: number,sleep:boolean = false,mills:number = 3 * 60 * 1000) {
        fn();
        this.stop();
        if(sleep){
            this.latestOpTime = Date.now();
            this.interValId = window.setInterval(() => {
                if(Date.now() - this.latestOpTime  < mills){
                    fn()
                }
            }, t)
        }else{
            this.interValId = window.setInterval(() => {
                fn()
            }, t)
        }
        selfStorage.setItem(this.key, this.interValId);
    }

    stop() {
        if (this.interValId) {
            selfStorage.removeItem(this.key)
            clearInterval(this.interValId)
        }

    }
}

const widgetInterVar = new Interval("widgetIntervalId");

export {
    widgetInterVar
}