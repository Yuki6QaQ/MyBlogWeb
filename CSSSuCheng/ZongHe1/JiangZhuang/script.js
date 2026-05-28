
document.addEventListener('DOMContentLoaded', function () {
    console.log('奖状展示页面已加载');
    const models = document.querySelectorAll('.model');

    models.forEach(model => {
        model.addEventListener('click', function () {
            // 示例：点击时打印日志，后续可扩展为模态框显示大图
            console.log('点击了奖状:', this.querySelector('.card-title')?.nextElementSibling || '未知奖状');
        });
    });
});