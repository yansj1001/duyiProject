//单个商品数据,因为商品数据为一个数组，此处仅对指定下标的数据进行初步处理
class uiGoods{
    constructor(goods){
        this.data = goods
        this.choose = 0
    }
    //计算总价
    getTatolPrice(){
        return this.data.price * this.choose
    }
    //判断是否选择
    getChooseStatus(){
        return this.choose > 0
    }
    //增加数量
    increase(){
        this.choose++
    } 
    //减少数量
    decrease(){
        if(this.choose === 0){
            return
        }
        this.choose--
    }
}
//界面上的所有数据，此处将数组逐个拆分，并将每个数据交给uiGoods并创建实例对象，再将实例对象保存到数组中，同时添加一些其他需要用到的属性
class uiData{
    constructor(){
        let Goods = []
        for(let i=0; i<goods.length; i++){
            const uig = new uiGoods(goods[i])
            Goods.push(uig)
        }
        //将数组保存
        this.Goods = Goods
        this.qisongfei = 30
        this.peisongfei = 3
    }
    //获取商品总价
    getTatolPrice(){
        let sum = 0
        for(let i=0; i<this.Goods.length; i++){
            sum += this.Goods[i].data.price * this.Goods[i].choose
        }
        return sum
    }
    //增加某个商品的数量
    increase(index){
        this.Goods[index].increase()
    }
    //减少某个商品的数量
    decrease(index){
        this.Goods[index].decrease()
    }
    //计算当前选中的商品数量
    getTatolChooseNumber(){
        let sum = 0
        for(let i=0; i<this.Goods.length; i++){
            sum += this.Goods[i].choose
        }
        return sum
    }
    //判断购物车是否有商品
    hasShopCar(){
        //判断被选中的总数，如果等于零则返回false，否则返回true
        if (this.getTatolChooseNumber() === 0) {
            return false
        }
        return true
    }
    //判断是否超过起送门槛
    isCorssDeliveryThreshold(){
        //根据总价函数返回的数据与起送费比较
        if(this.getTatolPrice() >= this.qisongfei){
            return true
        }
        return false
    }
    //判断当前索引的商品的选中状态
    isChoose(index){
        return this.Goods[index].getChooseStatus()
    }
}
//界面的处理
class UI{
    constructor(){
        //通过uiData创建实例，用于使用相关的数据
        this.goodData = new uiData()
        //使用对象保存dom，更加整洁
        this.doms = {
            //商品容器
            goodContainer: document.querySelector(".goods-list"),
            //配送费容器
            deliveryPrice: document.querySelector(".footer-car-tip"),
            //总价容器
            tatolFooter: document.querySelector(".footer-car-total"),
            //支付容器
            payFoot: document.querySelector(".footer-pay"),
            //起送费容器
            payFooterSapn: document.querySelector(".footer-pay span"),
            //购物车容器
            shopCar: document.querySelector(".footer-car"),
            //商品数量容器
            shopNumber: document.querySelector(".footer-car-badge")
        }
        //通过getBoundingClientRect()来获取当前元素的坐标，尺寸等参数
        let Rect = this.doms.shopCar.getBoundingClientRect()
        //此处用于设置选中动画效果的结束位置
        const jumpTarget = {
            left: Rect.left + Rect.width / 2,
            top: Rect.top + Rect.height / 4
        }
        //将结束位置保存
        this.jumpTarget = jumpTarget
        this.createHtml()
        this.updateFooter()
        //在实例创建时就将动画移出，以便多次调用动画
        this.eventListener()    
    }
    //移除animate类，防止再次调用没有动画效果
    eventListener(){
        this.doms.shopCar.addEventListener("animationend",function(){
            this.classList.remove("animate")
        })
    }
    //动态创建html元素
    createHtml(){
        let html = ''
        for(let i=0; i<this.goodData.Goods.length; i++){
            //此处注意需要将所有循环的结果都拼接到一起才可以正常显示
            //如果只在每次循环将html重新赋值而非拼接，则页面中只会渲染最后一个元素的内容
            html += `<div class="goods-item">
            <img src="${this.goodData.Goods[i].data.pic}" alt="" class="goods-pic" />
            <div class="goods-info">
              <h2 class="goods-title">${this.goodData.Goods[i].data.tittle}</h2>
              <p class="goods-desc">
               ${this.goodData.Goods[i].data.desc}
              </p>
              <p class="goods-sell">
                <span>月售 ${this.goodData.Goods[i].data.sellNumber}</span>
                <span>好评率${this.goodData.Goods[i].data.favorRate}%</span>
              </p>
              <div class="goods-confirm">
                <p class="goods-price">
                  <span class="goods-price-unit">￥</span>
                  <span>${this.goodData.Goods[i].data.price}</span>
                </p>
                <div class="goods-btns">
                  <i index="${i}" class="iconfont i-jianhao"></i>
                  <span>${this.goodData.Goods[i].choose}</span>
                  <i index="${i}" class="iconfont i-jiajianzujianjiahao"></i>
                </div>
              </div>
            </div>
          </div>`
          
        }
        this.doms.goodContainer.innerHTML = html
    }
    //添加商品，没添加一个商品都会调用相关方法，改变页面效果
    increase(index){
        this.goodData.increase(index)
        this.updateClass(index)
        this.updateFooter()
        this.jump(index)
    }
    //去除商品，作用同上
    decrease(index){
        this.goodData.decrease(index)
        this.updateClass(index)
        this.updateFooter()
    }
    //该函数用于商品被选中时在加号旁边显示商品数量以及减号
    updateClass(index){
        let goodsDom = this.doms.goodContainer.children[index]
        //判断当前商品是否被选中
        if(this.goodData.isChoose(index)){
            goodsDom.classList.add("active")
        } else {
            goodsDom.classList.remove("active")
        }
        let chooseNumber = goodsDom.querySelector(".goods-btns span")
        //将当前商品选中的数量显示出来
        chooseNumber.textContent = this.goodData.Goods[index].choose
    }
    //更新页面底部界面
    updateFooter(){
        //计算并保存当前的商品总价
        let tatol = this.goodData.getTatolPrice()
        //toFixed(2)，该方法用于设置保留小数的位数，参数就是要保留的位数
        tatol = tatol.toFixed(2)
        this.doms.deliveryPrice.textContent = `配送费￥${this.goodData.peisongfei}`
        //判断当前是否满足起送价
        if (this.goodData.isCorssDeliveryThreshold()) {
            this.doms.payFoot.classList.add("active")
        } else {
            this.doms.payFoot.classList.remove("active")
            let dis = this.goodData.qisongfei - tatol
            dis = dis.toFixed(2)
            //不满足起送价时显示还差多少
            this.doms.payFooterSapn.textContent = `还差￥${dis}元起送`
        }
        //总价部分的显示
        this.doms.tatolFooter.textContent= `${tatol}`
        //判断购物车中是否有商品
        if(this.goodData.hasShopCar()){
            this.doms.shopCar.classList.add("active")
            //设置购物车右上角显示的数字为商品的总数
            this.doms.shopNumber.textContent = `${this.goodData.getTatolChooseNumber()}`
        } else {
            this.doms.shopCar.classList.remove("active")
        }
    }
    //购物车的动画，即添加类生效
    carAnimate(){
        this.doms.shopCar.classList.add("animate")
    }
    //选中商品以及添加商品时的动画
    jump(index){
        //由于商品在未选择时只会显示加号按钮，此处获取以便后续操作
        const btnAdd = this.doms.goodContainer.children[index].querySelector(".i-jiajianzujianjiahao")
        //getBoundingClientRect()获取按钮的尺寸以及坐标属性
        const rect = btnAdd.getBoundingClientRect()
        //通过一个对象将起始坐标存储
        const start = {
            x:rect.left,
            y:rect.top
        }
        //创建用于动画显示的元素节点
        const div = document.createElement("div")
        div.className = "add-to-car"
        const i = document.createElement("i")
        i.className = "iconfont i-jiajianzujianjiahao"
        //此处为抛物线的实现，即创建的外部的diV用于控制x方向的移动，内部的i用于控制y方向的移动，结合过度效果，具体过度在add-to-cas.css中
        div.style.transform=`translateX(${start.x}px)`
        i.style.transform=`translateY(${start.y}px)`
        div.appendChild(i)
        document.body.appendChild(div)
        //读取盒子宽度，强行渲染
        div.clientWidth
        
        //结束位置
        div.style.transform=`translateX(${this.jumpTarget.left}px)`
        i.style.transform=`translateY(${this.jumpTarget.top}px)`
        //绑定事件，用于处理过度结束的操作
        div.addEventListener("transitionend",()=>{
            //删除创建的元素
            div.remove()
            //调用购物车动画
            this.carAnimate()
        },{
            //此处为配置对象，该属性值为true时，代表事件在单次触发时只会执行一次
            once:true
        })
    }

}
//创建UI的实例
const ui = new UI()

//事件，用于实现交互
ui.doms.goodContainer.addEventListener("click",(e)=>{
    //此处用于判断类的样式表中是否包含指定类
    if (e.target.classList.contains("i-jiajianzujianjiahao")) {
        //获取指定属性的值，此处的 index 在创建商品信息时一同创建， 用于获取当前事件触发对象的索引值，以便后续函数调用时使用
        let index = e.target.getAttribute("index")
        ui.increase(index)
    } else {
        let index = e.target.getAttribute("index")
        ui.decrease(index)
    }
})
