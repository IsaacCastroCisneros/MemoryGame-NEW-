import images from "../../dist/dist-files/images.json";
import setDelay from "../util/delay";
import addGlobalEventListener from "../util/addGlobalEventListener";
import { showCards } from "./main";

let clicks =[];
let cardsSelected =[];
let sameCards = 0;
let tries = 6;

const failureImg= './dist-files/dist-images/cross.png';
const succesImg= './dist-files/dist-images/check.png';
const winImg = './dist-files/dist-images/elon.png';
const loseImg = './dist-files/dist-images/akko.jpg';
const layerCardImg = './dist-files/dist-images/question.gif';
//xd
export function game()
{
    showCards();
    areHide();

    addGlobalEventListener('click','[data-card-layer]',e=>
    {
        if(clicks.length===2) return

        const actualCard = e.target.closest('[data-card]');

        if(actualCard===null || actualCard.dataset.hide==='false')return

        actualCard.classList.remove('hide');
        actualCard.dataset.hide=false;
        const actualCardId = actualCard.dataset.id; 

        clicks.push(actualCardId);
        compareCards(actualCard);
    })

    addGlobalEventListener('click','[data-game-button]',async e=>
    {
        clicks=[];
        cardsSelected=[];
        sameCards=0;
        tries=6;
    
        await setDelay(500);
    
        const msgs = document.querySelectorAll('[data-msg]');
        msgs.forEach(msg=>
        {
           msg.style.display='none';
        });
    
        const layer = document.querySelector('[data-game-layer]');
        layer.classList.add('show');
        
        showCards();
        const cards = document.querySelectorAll('[data-card]');
    
        [...cards].forEach(card=>
        {
            card.dataset.hide=false;
        })
        areHide();
        
        await setDelay(4000);
    
        msgs.forEach(msg=>
        {
           msg.style.removeProperty('display');
        });
        
        msgs[2].classList.remove('show');
    
        [...cards].forEach(card=>
        {
            card.dataset.hide=true;
        })
        areHide();
        layer.classList.remove('show');
    })
}


export function renderCards(image)
{
    const gameContainer = document.querySelector('[data-game-container]');

    const tempCard = document.querySelector('[data-card-template]');
    const cardClone = tempCard.content.cloneNode(true);
    const cardImg = cardClone.querySelector('[data-card-img]');
    const card = cardClone.querySelector('[data-card]');
    const cardLayer = cardClone.querySelector('[data-card-layer]');
    
    cardLayer.src=layerCardImg;
    cardImg.src=image.img;
    cardImg.draggable=false;
    cardLayer.draggable=false;
    card.dataset.id=image.id;
    card.dataset.hide=true;
   
    gameContainer.appendChild(cardClone);
}

export function areHide()
{
    const cards = document.querySelectorAll('[data-card]');
    
    [...cards].forEach(card=>
    {
        if(card.dataset.hide==='true')
        {
            card.classList.add('hide');
            card.style.pointerEvents='auto';
        }
        else if(card.dataset.hide==='false')
        {
            card.classList.remove('hide');
        }
    })
}

async function showNotification(bool)
{
    const notification = document.querySelector('[data-game-notification]');
    const check = document.querySelector('[data-game-check]');
    const cross = document.querySelector('[data-game-cross]');
    const notificationRemain = document.querySelector('[data-game-remain]');
    const layer = document.querySelector('[data-game-layer]');

    if(bool)
    {
        cross.classList.remove('show');
        check.classList.add('show');
        notificationRemain.textContent='COOL';    
    }
    else
    {
        check.classList.remove('show');
        cross.classList.add('show');
        notificationRemain.textContent='Remain: '+tries;
    }
    
    notification.classList.add('show'); 
    layer.classList.add('show')

    await setDelay(500);

    notification.classList.remove('show');
    layer.classList.remove('show');
    
}

function gameOver(img,text)
{
    const gameOverContainer = document.querySelector('[data-game-win-container]');
    const gameOverMsg = document.querySelector('[data-game-win]');
    const gameOverTitle = document.querySelector('[data-game-title]');
    const layer = document.querySelector('[data-game-layer]');
  
    gameOverMsg.src=img;
    gameOverTitle.textContent=text;

    layer.classList.add('show');
    gameOverContainer.classList.add('show');
    return gameOverMsg
}

async function compareCards(card)
{
    cardsSelected.push(card);
    
    if(clicks.length!==2)return

    const areSame = cardsSelected[0].dataset.id===cardsSelected[1].dataset.id;
    await setDelay(500);

    if(areSame)
    {   
        cardsSelected.forEach(card=>
        {
            card.style.pointerEvents='none';
            sameCards++ 
        })
        if(images.length===sameCards)
        {
            gameOver(winImg,'WIN').classList.remove('lose');
            return
        }

        showNotification(true);
        cardsSelected=[];   
    }
    else if(!areSame)
    {
        tries--;
        if(tries<0)
        {
            gameOver(loseImg,'LOSE').classList.add('lose')
            return
        }

        showNotification(false)
        cardsSelected.forEach(card=>
        {
            card.dataset.hide=true;
        })
        cardsSelected=[];
        areHide();

    }
    clicks=[];
}