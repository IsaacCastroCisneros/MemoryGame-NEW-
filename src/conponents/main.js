import images from "../../dist/dist-files/images.json";
import {renderCards} from "./game";
import {game} from "./game";

function randomizedImgs()
{
    for (let i = images.length -1; i > 0; i--) 
    {
        let j = Math.floor(Math.random() * i);
        
        [images[i],images[j]]=[images[j],images[i]];
    }
    return images
}


export function showCards()
{
    const cards = randomizedImgs();
    const container = document.querySelector('[data-game-container]');
    const layer = document.querySelector('[data-game-layer]');

    layer.classList.add('show');
    container.innerHTML='';

    cards.forEach(img=>
    {
        renderCards(img)
    })
}

game();


