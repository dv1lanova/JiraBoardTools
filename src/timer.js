import { h } from 'dom-chef';

const executeWhenLoaded = (selector, callback) => {
    const htmlElement = document.querySelector(selector);
    if (htmlElement === null) {
        setTimeout(() => executeWhenLoaded(selector, callback), 1000)
    } else {
        callback()
    }
}

const setStyle = (styles, domElement) => {
    Object.keys(styles).forEach(key => {
        domElement.style[key] = styles[key]
    })
}

const maxTime = 90
const timeToHurry = 10

let counter = null;
let counterIsRunning = false;
let currentTime = maxTime
let ticker = null

const startTicker = () => {
    if (!counterIsRunning) return;
    currentTime -= 1;
    counter.innerText = currentTime;
    if (currentTime < timeToHurry) {
        hurryUp()
    }
    if (currentTime < 0) {
        outOfTime()
    }
}

const resetTimer = () => {
    currentTime = maxTime;
    counter.innerText = currentTime;
}

const hurryUp = () => {
    resetStyles()
    counter.classList.add('hurry-up')
}

const outOfTime = () => {
    resetStyles()
    counter.classList.add('out-of-time')
}

const tickerStarted = () => {
    resetStyles()
    counter.classList.add('ticker-started')
}
const resetStyles = () => {
    counter.classList.remove('out-of-time')
    counter.classList.remove('hurry-up')
    counter.classList.remove('ticker-started')
}

const play = () => {
    if (counterIsRunning) {
        resetTimer()
        counterIsRunning = false;
        resetStyles()
        clearInterval(ticker)

    } else {
        counterIsRunning = true
        tickerStarted()
        ticker = setInterval(() => {
            startTicker()
        }, 1000)
    }

}

const renderTimer = () => {
    return(
    <span id='timer' className='timer' onClick={play}>
        {maxTime}
    </span>
    )
}

const render = async () => {
    executeWhenLoaded('#assignee-filter', () => {
        const subnav = document.querySelector('#assignee-filter')
        setStyle({ display: 'flex' }, subnav)
        counter = renderTimer();
        subnav.appendChild(counter);
    });
}

export default render