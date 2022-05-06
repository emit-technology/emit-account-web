export const utils = {
    ellipsisStr: function (v: string, num?: number) {
        if (!v) return ""
        if (!num) {
            num = 7
        }
        if (v.length >= 15) {
            return v.slice(0, num) + " ... " + v.slice(v.length - num, v.length);
        }
        return v
    },

    signFormae :function (){

    }

}

export function getParentUrl() {
    let url = "";
    if (window.parent !== window) {
        try {
            url = window.parent.location.href;
        }catch (e) {
            url = document.referrer;
        }
    }
    return url;
}