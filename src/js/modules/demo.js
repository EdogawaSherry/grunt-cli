const demo = {
    title: null,
    init() {
        $('.bg').click(() => {
            alert(333);
        });
        this.title = '我的sss';
        console.log(this.title);
        // this.addEvent();
        this.addEvent();
        console.log(this);
    },
    addEvent() {
        console.log('添加');
    },
    removeEvent() {},
    destory() {
        this.removeEvent();
    }
};
module.exports = demo;
