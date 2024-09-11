const realContents = document.querySelector('.realContents');
const fakeContent = document.querySelector('.fakeContent');
const tableWraper = document.querySelector('.tableWraper');
const addTesting = null
const addT2 = null
let start = 0
let end = start + 20
const generateRandom100Numbers = (continueFrom=0)=>{
    let numList = []
    for (let i = 0; i < 100; i++) {
        numList.push(continueFrom+1+i)
    }
    return numList
}
let myList1 = [];
let visibleList = []
const getContents = (list)=>{
    realContents.innerHTML = `
    <div class="contentHeader freezeTop">
        <div class="headerItem freezeLeft">index</div>
        <div class="headerItem">N-1</div>
        <div class="headerItem">N-2</div>
        <div class="headerItem">N-3</div>
        <div class="headerItem">N-4</div>
        <div class="headerItem">N-5</div>
        <div class="headerItem">N-6</div>
        <div class="headerItem">N-7</div>
        <div class="headerItem">N-8</div>
        <div class="headerItem">N-9</div>
        <div class="headerItem">N-10</div>
        <div class='floatRightHeader'></div>
    </div>
    `
    for (let i = 0; i < list.length; i++) {
        realContents.innerHTML += `
        <div class="contentItems ${i==0?'first':(i==list.length-1?'last':'')}">
            <div class="contentData freezeLeft">${start+1+i}</div>
            <div class="contentData">No-${list[i]}</div>
            <div class="contentData">No-${list[i]}</div>
            <div class="contentData">No-${list[i]}</div>
            <div class="contentData">No-${list[i]}</div>
            <div class="contentData">No-${list[i]}</div>
            <div class="contentData">No-${list[i]}</div>
            <div class="contentData">No-${list[i]}</div>
            <div class="contentData">No-${list[i]}</div>
            <div class="contentData">No-${list[i]}</div>
            <div class="contentData ">No-${list[i]}</div>
            <div class='floatRight'></div>
        </div>
        `
        // realContents.innerHTML += `
        // <div class="contentItems ${i==0?'first':(i==list.length-1?'last':'')}">
        //     <div class="contentData">${list[i]+1}</div>
        //     <div class="contentData">${list[i]+2}</div>
        //     <div class="contentData">${list[i]+3}</div>
        //     <div class="contentData">${list[i]+4}</div>
        //     <div class="contentData">${list[i]+5}</div>
        //     <div class="contentData">${list[i]+6}</div>
        //     <div class="contentData">${list[i]+7}</div>
        //     <div class="contentData">${list[i]+8}</div>
        //     <div class="contentData">${list[i]+9}</div>
        //     <div class="contentData">${list[i]+10}</div>
        // </div>
        // `
    }
}
const sendRequest = (page, pageSize, list) =>{
    let dataList = []
    if(list.length < 1 && page == 1){
        list = generateRandom100Numbers()
    }else{
        dataList = generateRandom100Numbers(page * pageSize)
        for (let i = 0; i < list.length; i++) {
            for (let innnerIndex = 0; innnerIndex < dataList.length; innnerIndex++) {
                if(list[i] == dataList[innnerIndex]){
                    dataList.splice(innnerIndex, 1)
                }
            }
        }
        if(dataList.length >= 1){
            list = list.concat(dataList)
            dataList = []
        }
    }
    return list
}
let oldScrollTop = 0
let page = 1
let pageSize = 100
let xPos = 0
window.addEventListener('DOMContentLoaded', ()=>{
    myList1 = sendRequest(page, pageSize, myList1)
    visibleList = myList1.slice(start, end)
    fakeContent.style.minHeight = `${myList1.length * 40}px`
    getContents(visibleList);
    xPos = document.querySelector('.floatRight').getBoundingClientRect().x
    document.querySelector('.floatRightHeader').style.transform = `translateX(${xPos - document.querySelector('.floatRightHeader').getBoundingClientRect().x - 8}px)`
})
const getShadow = (direction='y', on=true) => {
    let isShadowed = document.querySelector('.contentHeader').classList.contains('shadowed')
    if(on){
        if(direction == 'y'){
            if(!isShadowed){
                document.querySelector('.contentHeader').classList.add('shadowed')
            }
        }
        if(direction == 'x'){
            document.querySelectorAll('.freezeLeft').forEach(item=>{
                if(!item.classList.contains('shadowed')){
                    item.classList.add('shadowed')
                }
            })
        }
    }else{
        if(direction == 'y'){
            if(isShadowed){
                document.querySelector('.contentHeader').classList.remove('shadowed')
            }
        }
        if(direction == 'x'){
            document.querySelectorAll('.freezeLeft').forEach(item=>{
                if(item.classList.contains('shadowed')){
                    item.classList.remove('shadowed')
                }
            })
        }
    }
}
let scrollTopOld = 0
let scrollLeftOld = 0
const getDirection = (oldY, oldX, newY, newX) =>{
    if(oldY != newY){
        oldY = newY
        return 'y'
    }else if(oldX != newX){
        oldX = newX
        return 'x'
    }
}
tableWraper.addEventListener('scroll', (e)=>{
    let directionNow = getDirection(scrollTopOld, scrollLeftOld, e.target.scrollTop, e.target.scrollLeft)
    
    // let scrollPercent = Number((e.target.scrollTop / e.target.scrollHeight)*100).toFixed(0)
    start = Math.floor(e.target.scrollTop / 40)
    end = start + 20
    if(oldScrollTop < e.target.scrollTop){
        if(end >= Math.floor((page*pageSize) * 0.7)){
            page++
            myList1 = sendRequest(page, pageSize, myList1)
        }
    }else{
        if(end <= Math.floor(((page-1)*pageSize) * 0.7)){
            if(page > 1){
                page--
            }
            myList1 = sendRequest(page, pageSize, myList1)
        }
    }
    visibleList = myList1.slice(start, end)
    getContents(visibleList)
    if(e.target.scrollLeft >= e.target.scrollWidth - e.target.getBoundingClientRect().width){
        document.querySelectorAll('.floatRight').forEach(item=>{
            xPos = item.getBoundingClientRect().x
            item.style.display = 'none'
        })
        document.querySelector('.floatRightHeader').style.display = 'none'
        
    };
    document.querySelectorAll('.floatRight').forEach(item=>{
        xPos = item.getBoundingClientRect().x
        item.style.transform = `translateX(${e.target.scrollLeft}px)`
    })
    document.querySelector('.floatRightHeader').style.transform = `translateX(${xPos - document.querySelector('.floatRightHeader').getBoundingClientRect().x + e.target.scrollLeft - 8}px)`
    realContents.style.top = `${start * 40}px`
    if(directionNow == 'y'){
        scrollTopOld = e.target.scrollTop
        getShadow('y', true)
    }else{
        scrollLeftOld = e.target.scrollLeft
        getShadow('x', true)
    }
})
tableWraper.addEventListener('scrollend', (e)=>{
    getShadow('y', false)
    getShadow('x', false)
})