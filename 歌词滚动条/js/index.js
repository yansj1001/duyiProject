/**
 * 将歌词字符串转换为对象
 * 对象格式为：{time: 歌词开始的时间,words: 歌词}
 */
function parseLrc(){
    let links = lrc.split("\n")
    let lrcArr = []
    for(let i=0; i<links.length; i++){
        let past = links[i].split("]")
        //console.log(past);
        let timeStr = past[0].substring(1)
        //console.log(timeStr);
        const obj = {
            time:changeTime(timeStr),
            words:past[1]
        }
        //console.log(obj);
        lrcArr.push(obj)
        //console.log(lrcArr);
    }
    //console.log(lrcArr);
    return lrcArr
}
/**
 * 将时间字符串转换为数据（秒）
 * @param {String} timeStr 时间字符串
 * @returns 转换后的时间
 */
function changeTime(timeStr){
    let time = timeStr.split(":")
    return +time[0]*60 + +time[1]
}
const lrcData = parseLrc()

const doms = {
    audio:document.querySelector("audio"),
    ul:document.querySelector(".container ul"),
    container:document.querySelector(".container")
}
/**
 * 该函数用来计算当前需要高亮显示的歌词的索引值
 * 当前时间小于索引为0时的时间时，会返回-1
 */
function findIndex(){
    const currTime = doms.audio.currentTime
    for(let i=0; i<lrcData.length; i++){
        if(currTime < lrcData[i].time){
            return i-1
        }
    }
    //函数如果会执行到这里，则说明当前时间大于lrcData中的所有时间，此时应该返回最后一个的索引，让其高亮显示最后一个索引的内容
    return lrcData.length-1
}
/**
 * 在页面中创建歌词元素 li
 */
function createLrc(){
    //此处创建一个文档片段，收集需要增加的节点，最后统一添加到页面中，只修改一次dom树
    //需要注意，不要事先优化，只在效率出现问题时在进行优化，此处的优化为使用文档片段一次性添加
    //此处的优化可以忽略，即依然一个一个添加即可
    const farg = document.createDocumentFragment()
    for(let i=0; i<lrcData.length; i++){
        const li = document.createElement("li")
        li.textContent=lrcData[i].words
        farg.appendChild(li)
    }
    doms.ul.appendChild(farg)
}
createLrc()

//获取容器高度
let containerHeight = doms.container.clientHeight
//获取li标签的高度
let liHeight = doms.ul.children[0].clientHeight
//设置最大偏移量
let maxOffset = doms.ul.clientHeight - containerHeight / 2

function highBright(){
    let index = findIndex()
    //获取偏移量的思路为使用 index 个li标签的高度加上li标签一半的高度减去容器一般的高度
    let offset = liHeight*index + liHeight / 2 - containerHeight / 2
    //最小偏移量
    if (offset < 0) {
        offset = 0
    }
    //最大偏移量
    if (offset > maxOffset) {
        offset = maxOffset
    }
    doms.ul.style.transform = `translateY(-${offset}px)`
    //获取存在类名为active的li标签
    let li = document.querySelector(".active")
    //如果存在，则清除
    if (li) {
        li.classList.remove("active")
    }
    //判断当前索引是否有li标签与其对应，因为索引可能为负数
    li = doms.ul.children[index]
    //如果li存在，则将active类添加
    if (li) {
        li.classList.add("active")
    }

}
//此处绑定一个时间变化事件，audio的时间发生变化就会调用highBright函数
doms.audio.addEventListener("timeupdate",highBright)